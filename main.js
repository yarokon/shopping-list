$(document).ready(function() {
  'use strict';

  var id = 0;

  function nextId() {
    return 'id' + id++;
  }

  $('#textField').keyup(function(e) {
    var article;
    if (e.which === 13) {
      article = $(this).val().trim();

      if (article) {
        $(this).val('');
        insertGoods(article);
      } 

    saveData();
    }
  });

  $('#deleteButton').click(function() {
    $('li > span:first-child').each(function() {
      if ($(this).hasClass('glyphicon-check')) {
        $(this).parent().animate({left: '100%', opacity: '0'}, 800, function() {
          $(this).slideUp('slow', function() {
            $(this).remove();
            if (!$('ul').children().html()) {
              id = 0;
            }

            saveData();
          });
        });
      }
    });
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

    saveData();
  });

  function insertGoods(value, isChecked) {
    var listItem, checkboxItem, inputItem, removeItem;

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
    bindListeners(listItem);
    $('ul').prepend(listItem);
    $(listItem).slideUp(0, function(){
        $(this).slideDown();
    });
  }

  function bindListeners(listItem) {
    var tempValue;
    var firstSpan = listItem.children('span:first');
    var lastSpan = listItem.children('span:last');
    listItem = $(listItem);

    listItem.dblclick(function(){
      var inputItem = listItem.children('input');

      if (firstSpan.hasClass('glyphicon-unchecked')) {
        $(inputItem).attr('disabled', false);
        tempValue = $(inputItem).val();
      }

      inputItem.focus();
    });

    listItem.children('input').keyup(function(e) {
      switch(e.which){
        case 13:
          if (!$(this).val().trim()) {
              $(this).parent().slideUp(400 , function(){
                $(this).remove();
                saveData();
            });
          }
          $(this).attr('disabled', true);
          saveData();
          break;
        case 27:
          $(this).val(tempValue);
          $(this).attr('disabled', true);
      }
    });

    listItem.children('input').blur(function(){
      $(this).attr('disabled', true);
    });

    firstSpan.click(function(){
      firstSpan.next().toggleClass('crossed');
      firstSpan.toggleClass('glyphicon-check glyphicon-unchecked');
      saveData();
    });

    lastSpan.click(function(){
      $(this).parent().slideUp(400 , function(){
        $(this).remove();
        saveData();
      });
    });

    listItem.hover(
    function(){
      lastSpan.css('display', 'block');
    },
    function(){
      lastSpan.css('display', 'none');
    });
  }

  function prepareData() {
    var value, isChecked;
    var itemData = {};
    var localData = [];

    $('li').each(function() {
      itemData = {};
      itemData.article = $(this).children('input').val();
      itemData.isChecked = $(this).children('span:first').hasClass('glyphicon-check');

      localData.push(itemData);
    });

    return localData.reverse();
  }

  function saveData() {
    localStorage.setItem('data', JSON.stringify(prepareData()));
  }

  $(window).load(function() {
    var localData = JSON.parse(localStorage.getItem('data'));
    if (localData) {
      localData.forEach(function(itemData) {
        insertGoods(itemData.article, itemData.isChecked);
      });
    }
  });
});