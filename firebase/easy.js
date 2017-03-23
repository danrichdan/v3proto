$(document).ready(function(){
    $('.sgt-form').on('click', '.btn-success', function(){
        console.log('In the click handler for the green button');
        var fdata = getFormData();
        addStudent(fdata.sid, fdata.sname, fdata.course, fdata.grade);
        clearForm();
    }).on('click', '.btn-info', function(){
        updateStudent($(this).attr('data-uid'));
        $(this).removeClass('btn-info').addClass('btn-success').attr('data-uid', null).text('Add Student');
        clearForm();
    }).on('click', '#clear-form', function(){
        $('#add-student').removeClass('btn-info').addClass('btn-success').attr('data-uid', null).text('Add Student');
        clearForm();
    });

    $('.sgt').on('click', '.delete', function(){
        var studentKey = $(this).closest('td').attr('data-uid');
        deleteStudent(studentKey, $(this).closest('tr'));
    }).on('click', '.edit', function(){
        var studentKey = $(this).closest('td').attr('data-uid');
        $('#add-student').removeClass('btn-success').addClass('btn-info').attr('data-uid', studentKey).text('Update Student');
        var fdata = getRowData($(this).closest('tr'));
        populateFormData(fdata.sid, fdata.sname, fdata.course, fdata.grade);
    });
});

// Add config data
var config = {
    apiKey: "AIzaSyBp6NtIXf0lvcBBfkaNbnkKwKS9jbamJiQ",
    authDomain: "lfzproto.firebaseapp.com",
    databaseURL: "https://lfzproto.firebaseio.com",
    storageBucket: "lfzproto.appspot.com",
    messagingSenderId: "1039834332547"
};
// Init firebase
firebase.initializeApp(config);
// Create firebase ref
var fbRef = firebase.database();

// Create event listener for the students node in your database
fbRef.ref('students').on('value', function(snapshot){
    updateDom(snapshot.val());
});
// Complete the addStudent function
function addStudent(sid, sname, course, grade){
    console.log('In the addStudent function');
    var dataToSend = {
        student_id: sid,
        student_name: sname,
        course: course,
        grade: grade
    };
    console.log(dataToSend);
    fbRef.ref('students').push(dataToSend);
}

// complete the delete function
function deleteStudent(key, ele){
    console.log('In the delete student function');
    console.log('Here is the information from the nearest student row', ele);
    var studentData = getRowData(ele);
    console.log('Here is the information from the nearest student row', studentData);
    var confirmed = confirm('Are you sure that you want to delete this student? ' + ' ' + studentData.sname);
    if (confirmed == true) {
        fbRef.ref('students/'+ key).remove();
    }
}

// complete the update function
function updateStudent(id){
    console.log('in the update student function');
    console.log(id);
    var updates = {};
    updates['students/' + id +'/course'] = $('#course').val();
    updates['students/' + id +'/grade'] = $('#grade').val();
    updates['students/' + id +'/student_id'] = $('#sid').val();
    updates['students/' + id +'/student_name'] = $('#sname').val();
    fbRef.ref().update(updates);
};

function updateDom(d){
    console.log('In the update DOM function, the value for the parameter d is: ', d);
    var table = $('.sgt tbody');
    table.html('');
    for(var key in d){
        if(d.hasOwnProperty(key)){
            var row = $('<tr>');
            var id = $('<td class="sid">' + d[key].student_id + '</td>');
            var name = $('<td class="sname">' + d[key].student_name + '</td>');
            var course = $('<td class="course">' + d[key].course + '</td>');
            var grade = $('<td class="grade">' + d[key].grade + '</td>');
            var actions = $('<td>', {'data-uid': key});
            var edit = $('<button>', {
                class: 'btn btn-sm btn-info edit',
                text: 'Edit'
            });
            var del = $('<button>', {
                class: 'btn btn-sm btn-danger delete',
                text: 'Delete'
            });

            table.append(row.append(id, name, course, grade, actions.append(edit, del)));
        }
    }
}

function clearForm(){
    $('.sgt-form input').each(function(k, v){
        $(v).val('');
    });
}

function getFormData(){
    var output = {};
    $('.sgt-form input').each(function(k, v){
        var ele = $(v);
        output[ele.attr('id')] = ele.val();
    });

    return output;
}

function populateFormData(sid, sname, course, grade){
    $('#sid').val(sid);
    $('#sname').val(sname);
    $('#course').val(course);
    $('#grade').val(grade);
}

function getRowData(e) {
    return {
        sid: e.find('.sid').text(),
        sname: e.find('.sname').text(),
        course: e.find('.course').text(),
        grade: e.find('.grade').text()
    };
}