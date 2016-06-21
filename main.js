$(document).ready(function() {
  'use strict';

  var id = -1;

  function nextId() {
    return 'id' + (++id);
  }

  $('#textField').keyup(function(e) {
    var food;
    if (e.which === 13) {
      food = $(this).val();

      if (food) {
        $(this).val('');
        insertFood(food);
      } 
    }
  });

  $('#deleteButton').click(function() {
    $('li > span:first-child').each(function() {
      if ($(this).hasClass('glyphicon-check')) {
        $(this).parent().remove();
      }
    });

    if (!$('ul').children().html()) {
      id = -1;
    }
  });

  $('#checkButton').click(function(){
    var allCheck = true;

    $('li > span:first-child').each(function() {
      allCheck = allCheck && $(this).hasClass('glyphicon-check');
    });

    if (allCheck) {
      $(this).attr('data-checked', true);
    } else {
      $(this).attr('data-checked', false);
    }

    if (JSON.parse($(this).attr('data-checked'))) {
        $('li > span:first-child').removeClass('glyphicon-check')
          .addClass('glyphicon-unchecked');
        $('li > input').removeClass('crossed');
    } else {
        $('li > span:first-child').removeClass('glyphicon-unchecked')
          .addClass('glyphicon-check');
        $('li > input').addClass('crossed');
    }

    $(this).attr('data-checked', !allCheck);
  });

  function insertFood(value, isChecked) {
    var listItem, checkboxItem, inputItem, removeItem;

    isChecked = false || isChecked;

    inputItem = $('<input>').attr({
      type: 'text',
      class: 'form-control',
      disabled: true
    });
    inputItem.val(value);

    listItem = $('<li></li>').attr({
      id: nextId(),
      class: 'list-group-item list-group-item-info'
    });

    checkboxItem = $('<span></span>').addClass('glyphicon');
    removeItem = $('<span></span>').addClass('glyphicon glyphicon-remove-circle');

    if (isChecked) {
      checkboxItem.addClass('glyphicon-check');
      inputItem.addClass('crossed');
    } else {
      checkboxItem.addClass('glyphicon-unchecked');
    }

    listItem.append(checkboxItem, inputItem, removeItem);
    bindEvent(listItem);
    $('ul').prepend(listItem);
  }

  function bindEvent(item) {
    var temp;

    $(item).dblclick(function(){
      var inputItem = $(this).children('input');

      if ($(this).children('span:first').hasClass('glyphicon-unchecked')) {
        $(inputItem).attr('disabled', false);
        temp = $(inputItem).val();
      }

      inputItem.focus();
    });

    $(item).children('input').keyup(function(e) {
      switch(e.which){
        case 13:
          $(this).attr('disabled', true);
          break;
        case 27:
          $(this).val(temp);
          $(this).attr('disabled', true);
      }
    });

    $(item).children('span:first').click(function(){
      $(this).next().toggleClass('crossed');
      $(this).toggleClass('glyphicon-check glyphicon-unchecked');
    });

    $(item).children('span:last').click(function(){
      $(this).parent().remove();
    });

    $(item).hover(
    function(){
      $(this).children('span:last').css('display', 'block');
    },
    function(){
      $(this).children('span:last').css('display', 'none');
    });
  }

  function saveData() {
    var value, isChecked;
    var localData = [];

    $('li').each(function() {
      value = $(this).children('input').val();
      isChecked = $(this).children('span:first').hasClass('glyphicon-check');

      localData.push([value, isChecked]);
    });

    return localData.reverse();
  }

  $(window).unload(function() {
    localStorage.data = JSON.stringify(saveData());
  });

  $(window).load(function() {
    var localData = JSON.parse(localStorage.data);
    localData.forEach(function(item) {
      insertFood(item[0], item[1]);
    });
  });
});