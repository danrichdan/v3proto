$(document).ready(function(){

    //ADD STUDENT BUTTON
    $('.sgt-form').on('click', '.btn-success', function(){
        console.log('In the click handler for the green button');
        //CLICKING THE ADD BUTTON CREATES AN OBJECT OUT OF THE FORM FIELDS' VALUES
        var fdata = getFormData();
        console.log('here is the value for fdata', fdata);
        //THE OBJECT THAT WAS CREATED FROM THE FORM IS USED TO CREATE PARAMETERS
        //FOR THE ADDSTUDENT FUNCTION--
        //THE OBJECT'S PROPERTIES ARE THE PARAMETERS
        addStudent(fdata.sid, fdata.sname, fdata.course, fdata.grade);
        //FORM IS CLEARED
        clearForm();

        //UPDATE STUDENT BUTTON
        //SHOWS AFTER THE EDIT BUTTON HAS BEEN CICKED
    }).on('click', '.btn-info', function(){
        //'THIS' IS THE UPDATE STUDENT BUTTON TAG
        //IT HAS THE ATTR DATA-UID, THIS ID IS WHAT GETS PASSED
        //TO THE UPDATESTUDENT FUNCTION
        updateStudent($(this).attr('data-uid'));
        //AFTER THE UPDATESTUDENT FUNCITON IS CALLED
        //THE BTN-INFO CLASS IS REMOVED
        //SETS THE DATA-UID ATTR FOR THE BUTTON TO NULL
        $(this).removeClass('btn-info').addClass('btn-success').attr('data-uid', null).text('Add Student');
        //THE FORM IS CLEARED
        clearForm();

        //CANCEL BUTTON
    }).on('click', '#clear-form', function(){
        //IF THE UPDATE STUDENT BUTTON IS SHOWING,
        //REMOVES THE BTN-INFO CLASS, ADDS THE BTN-SUCCESS CLASS
        //SETS THE DATA-UID ATTR FOR THE BUTTON TO NULL
        $('#add-student').removeClass('btn-info').addClass('btn-success').attr('data-uid', null).text('Add Student');
        //CLEARS THE FORM
        clearForm();
    });

        //DELETE BUTTON
    $('.sgt').on('click', '.delete', function(){
        //LOOKS FOR THE CLOSEST TD AND GETS THE DATA-UID ATTRIBUTE
        //THE BUTTON TAG IS THIS, IT'S PARENT IS THE TD WITH THE UID
        var studentKey = $(this).closest('td').attr('data-uid');
        //STORES THE TABLE ROWS UNIQUE ID IN A VARIABLE
        deleteStudent(studentKey, $(this).closest('tr'));
        //CALLS DELETESTUDENT FUNCTION USES THE DATA-UID ATTR AS A PARAMETER
        //FINDS THE CLOSEST TR TO THE DELETE BUTTON, USES AS SECOND PARAMETER

        //EDIT BUTTON
    }).on('click', '.edit', function(){
        console.log('This is the value for this inside the edit buttons\'s click handler: ',$(this));
        //LOOKS FOR THE CLOSEST TD AND GETS THE DATA-UID ATTRIBUTE
        //THE BUTTON TAG IS THIS, IT'S PARENT IS THE TD WITH THE UID
        var studentKey = $(this).closest('td').attr('data-uid');
        //STORES THE TABLE ROWS UNIQUE ID IN A VARIABLE
        console.log('this is the value for the studentKey in the Edit buttons click event: ', studentKey)
        $('#add-student').removeClass('btn-success').addClass('btn-info').attr('data-uid', studentKey).text('Update Student');
        //REMOVES CLASS FOR ADDING STUDENT BUTTON AND
        // ADDS CLASS FOR UPDATING STUDENT TO THAT BUTTON
        // AND ADDS ADDS THE UNIQUE IDENTIFIER AS AN ATTRIBUTE
        var fdata = getRowData($(this).closest('tr'));
        //CALLS FUNCTION CREATES AN OBJECT FROM THE TABLE ROWS DATA
        //STORES IN fdata VARIABLE/OBJECT
        console.log('Here is the value for fdata inside the edit buttons click handler: ', fdata);
        //USES THE PROPERTIES OF THE CREATED OBJECT AS PARAMETERS
        //IN THE POPULATEFORMDATA FUNCTION
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
fbRef.ref('students').once('value', function(snapshot){
    updateDom(snapshot.val());
});
// Complete the addStudent function
function addStudent(sid, sname, course, grade){
    console.log('In the addStudent function');
    //CREATES AN OBJECT FROM THE PARAMETERS
    var dataToSend = {
        student_id: sid,
        student_name: sname,
        course: course,
        grade: grade
    };
    console.log(dataToSend);
    //SENDS OBJECT TO DATABASE
    fbRef.ref('students').push(dataToSend);
}

// complete the delete function
function deleteStudent(key, ele){
    //key IS THE DATA-UID FROM THAT TD CLOSEST TO THE DELETE BUTTON
    //ele IS THE TABLE ROW THAT THE DELETE BUTTON SITS WITHIN
    console.log('In the delete student function');
    console.log('Here is the VALUE FOR THE PARAMETER ele', ele);
    console.log('Here is the VALUE FOR THE PARAMETER key', key);

    //CREATES AN OBJECT FROM THE TR's TD's
    var studentData = getRowData(ele);//seems pointless
    //PASSES IN THE TR AS A PARAMETER
    console.log('Here is the information from the nearest student row', studentData);
    //CREATES AN ALERT/CONFIRM BOX POP
    var confirmed = confirm('Are you sure that you want to delete this student? ' + ' ' + studentData.sname);
    //REMOVES THE STUDENT FROM THE DATABASE, THE UPDATE DOM FUNCTION IS CALLED WHEN THE DB CHANGES
    //SO DON'T REALLY NEED TO REMOVE THE ROW ELEMENT--- BUT SEEMS LIKE i SHOULD
    if (confirmed == true) {
        //removes from dom-- although seems unnecessary, used studentData before, but it should be a selector,
        // delete the whole row with ele which equals tr
        $('table.table .sgt tbody').remove(ele);
        //removes from db
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
    //CALLED WHEN PAGE LOADS AND WHEN ANY THING CHANGES,
    // LIKE WHEN THE ADD STUDEN FUNCTION IS CALLED
    console.log('In the update DOM function, the value for the parameter d is: ', d);
    var table = $('.sgt tbody');
    table.html('');
    for(var key in d){
        console.log('Here is the value of key in the updateDom function', key);
        //FOR IN LOOP, key VAR is the key, the object is d
        //d SEEMS TO BE THE DB, WHICH SEEMS TO BE AN ARRAY/OBJ
        //d's KEY NAMES ARE THE RANDOMLY GENERATED ID's
        //WHICH ARE OBJECTS
        //TO ACCESS EACH PROPERTY VALUE, IT USES OBJECT NOTATION
        // i.e. -KfrtSfQTuZ289p5p8hO.student_id
        //THESE ARE THE TEXT NODES FOR THE DOM TABLE ELEMENTS CREATED
        if(d.hasOwnProperty(key)){
            var row = $('<tr>');
            var id = $('<td class="sid">' + d[key].student_id + '</td>');
            var name = $('<td class="sname">' + d[key].student_name + '</td>');
            var course = $('<td class="course">' + d[key].course + '</td>');
            var grade = $('<td class="grade">' + d[key].grade + '</td>');
            var actions = $('<td>', {'data-uid': key}); // THIS IS THE UNIQUE IDENTIFIER IN FB,
            //MAKES THE KEY THE VALUE AND CREATES A data-uid KEY NAME

            //BUTTONS ARE APPENDED TO THE TD WITH THE DATA-UID
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
    //GETS CALLED AFTER THE UPDATE DOM FUNCTION
    console.log('In the clear form function');
    //ITERATES ACROSS THE INPUT FIELDS AND SETS THE VALUE TO EMPTY
    $('.sgt-form input').each(function(k, v){
        $(v).val('');
    });
}

function getFormData(){
    //CALLED WHEN ADD BUTTON IS CLICKED
    var output = {};
    $('.sgt-form input').each(function(k, v){
        //.EACH ITERATES OVER EACH INPUT, LIKE A LOOP
        // K IS THE INTEGER INDEX[0-3, OR HOWEVER MANY ELEMENTS THERE ARE],
        // V IS THE ELEMENT
        //V IS EACH OF THE THE ENTIRE INPUT TAGS
        //ie<input type='text' class'form-control' id="sid' placeholder='Student ID'>
        //ie<input type='text' class'form-control' id="sname' placeholder='Student Name'>
        var ele = $(v);
        //ele IS THE INPUT TAG
        //IT'S val IS WHAT THE USER INPUTS
        output[ele.attr('id')] = ele.val();
        //output[] IS THE SAME AS DOING output.sid, etc,BUT
        //THIS WAY EACH ID IS THE SAME AS THE OBJECTS KEYNAME
        //SO THE VALUES WILL MATCH UP AS IT ITERATES
        console.log('Here is the value of the output variable and its array that is created',output[ele.attr('id')] );
    });
    //OUTPUT IS STORED IN THE fdata VARIABLE WHEN THIS FUNCTION IS CALLED
    return output;
}

function populateFormData(sid, sname, course, grade){
    //CALLED WHEN THE EDIT BUTTON IS CLICKED
    //POPULATES THE FORM WITH DATA
    $('#sid').val(sid);
    $('#sname').val(sname);
    $('#course').val(course);
    $('#grade').val(grade);
}

function getRowData(e) {
    //CALLED FROM THE EDIT BUTTON AND THE DELETE BUTTON
    //e is the tr tag for the row associated
    // with the UNIQUE ID THAT WAS ADDED TO THE UPDATE STUDENT BUTTON
    console.log('here is the value for e in the getRowData function: ',e);
    return {
        //.FIND FINDS THE DESCENDENTS OF THE TR,
        // USING A FILTER - THE SELECTOR
        //IN THIS CASE, THE CLASSES
        //AND USES THE TEXT FOR THE KEY NAMES' VALUES OF THIS OBJECT
        //STORES IN FDATA OBJECT WHEN CALLED
        sid: e.find('.sid').text(),
        sname: e.find('.sname').text(),
        course: e.find('.course').text(),
        grade: e.find('.grade').text()
    };
}