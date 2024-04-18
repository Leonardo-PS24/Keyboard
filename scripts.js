import './node_modules/bootstrap/dist/js/bootstrap.bundle.js';


$(document).ready(function () {
    var currentInputName = "";
    var currentLanguage = "us";
    var currentLayout = "normal";
    var isCapsLock = false;
    var isShiftEnabled = false;
    var layouts;
    
    
    // Carica i layout delle tastiere dal file JSON
    $.getJSON("keyboard_layouts.json")
    .done(function (data) {
        console.log("Dati caricati correttamente:", data);
        layouts = data;
        updateKeyboardLayout();
    })
    .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.error("Errore durante il caricamento dei dati:", err);
    });
    
    // Funzione per la creazione della tastiera virtuale
    function updateKeyboardLayout() {
        if (!layouts || !layouts[currentLanguage]) {
            console.error("Layout non definito o non trovato per la lingua corrente");
            return;
        }
        var layout = layouts[currentLanguage];

        console.log(currentLanguage);
        console.log(layout);

        var rows = isShiftEnabled || isCapsLock ? layout.uppercase : layout.normal;

        if (currentLayout === 'symbol') {
            rows = layout.symbol;
        }

        if (currentLayout === 'numeric') {
            rows = layout.numeric;
        }

        var $keyboardContainer = $('#keyboard-container');
        $keyboardContainer.empty();

        rows.forEach(function (row) {
            var $keyboardRow = $('<div class="keyboard-row"></div>');

            row.forEach(function (key) {
                var keyElement;
                switch (key) {
                    case 'shift':
                        keyElement = '<div class="keyboard-key shift-toggle' + (isShiftEnabled ? ' active' : '') + '" data-key="shift"><i class="fa-solid fa-up-long"></i></div>';
                        break;
                    case 'capslock':
                        keyElement = '<div class="keyboard-key capslock-toggle' + (isCapsLock ? ' active' : '') + '" data-key="capslock"> <i class="fa-solid fa-a"></i> <i class="fa-solid fa-lock"></i> </div>';
                        break;
                    case 'lang':
                        keyElement = '<div class="keyboard-key" data-key="layout">' + '<i class="fa-solid fa-language"></i>' + '</div>';
                        break;
                    case 'delete':
                        keyElement = '<div class="keyboard-key" data-key="delete"> <i class="fa-solid fa-delete-left"></i> </div>';
                        break;
                    case 'space':
                        keyElement = '<div class="keyboard-key" data-key=" "> </div>';
                        break;
                    case 'set':
                        keyElement = '<div class="keyboard-key" data-key="setting"> <i class="fa-solid fa-gear"></i> </div>';
                        break;
                    case 'close-keyboard':
                        keyElement = '<div class="keyboard-key" data-key="close-keyboard"> <i class="fa-solid fa-keyboard"></i> <i class="fa-solid fa-chevron-down"></i> </div>';
                        break;
                    case 'symbol':
                        keyElement = '<div class="keyboard-key" data-key="symbol"> <b>123</b> </div>';
                        break;
                    case 'ABC':
                        keyElement = '<div class="keyboard-key" data-key="ABC"> <b>ABC</b> </div>';
                        break;
                    case 'tab':
                        keyElement = '<div class="keyboard-key" data-key="tab"> <b>tab</b> </div>';
                        break;
                    case 'enter':
                        keyElement = '<div class="keyboard-key" data-key="enter"> <b>enter</b> </div>';
                        break;
                    default:
                        keyElement = '<div class="keyboard-key" data-keyval="' + key + '">' + key + '</div>';
                }

                $keyboardRow.append(keyElement);
            });

            $keyboardContainer.append($keyboardRow);
        });
    };
    // $('input').focus(function () {
    //     currentInputName = $(this).attr('id');
    //     $('#keyboard-container').show();
    // });

    // Funzione per la gestione del tipo di layout in base al tipo di input
    $('input').focus(function () {
        var currentInput = $(this);
        currentInputName = currentInput.attr('id');
        $('#keyboard-container').show();

        var inputType = currentInput.attr('type');

        if ( inputType === 'number' || inputType === 'date') {
            currentLayout = "numeric";
            updateKeyboardLayout();

        }else if (inputType === 'text'){
            currentLayout = "normal";
            updateKeyboardLayout();
        }

    });
    



    // Funzione per la gestione del tasto Caps Lock
    $(document).on('mousedown', '.keyboard-key[data-key="capslock"]', function (event) {
        event.preventDefault();
        isCapsLock = !isCapsLock;
        isShiftEnabled = false;
        updateKeyboardLayout();
    });

    // Funzione per la gestione del tasto Shift
    $(document).on('mousedown', '.keyboard-key[data-key="shift"]', function (event) {
        event.preventDefault();
        isShiftEnabled = !isShiftEnabled;
        isCapsLock = false; 
        updateKeyboardLayout();
    });


    // Funzione per la gestione del tasto Delete
    $(document).on('mousedown', '.keyboard-key[data-key="delete"]', function (event) {
        event.preventDefault();
        var inputField = $('#' + currentInputName);
        var currentValue = inputField.val();
        var cursorPosition = inputField.prop('selectionStart');
        inputField.val(currentValue.slice(0, cursorPosition - 1) + currentValue.slice(cursorPosition));
    });

    // Funzione per la gestione del tasto Space
    $(document).on('mousedown', '.keyboard-key[data-key=" "]', function (event) {
        event.preventDefault();
        var inputField = $('#' + currentInputName);
        var currentValue = inputField.val();
        var cursorPosition = inputField.prop('selectionStart');
        inputField.val(currentValue.slice(0, cursorPosition) + ' ' + currentValue.slice(cursorPosition));
    });

    // Funzione per la gestione del tasto Tab
    $(document).on('mousedown', '.keyboard-key[data-key="tab"]', function (event) {
        event.preventDefault();
        var inputField = $('#' + currentInputName);
        var currentValue = inputField.val();
        var cursorPosition = inputField.prop('selectionStart');
        inputField.val(currentValue.slice(0, cursorPosition) + '\t' + currentValue.slice(cursorPosition));
    });

    // Funzione per la gestione del tasto Enter
    $(document).on('mousedown', '.keyboard-key[data-key="enter"]', function (event) {
        event.preventDefault();
        $('#' + currentInputName).blur();
        $('#keyboard-container').hide();
    });


    // Funzione per la gestione del tasto Setting
    $(document).on('click', '.keyboard-key[data-key="setting"]', function (event) {
        event.preventDefault();
        $('#settingsModal').modal('show');
    });

    // Funzione per la gestione del tasto Symbol
    $(document).on('mousedown', '.keyboard-key[data-key="symbol"]', function (event) {
        event.preventDefault();
        if (currentLayout === 'normal') {
            currentLayout = 'symbol';
        } 
        updateKeyboardLayout();
    });

    // Funzione per la gestione del tasto ABC
    $(document).on('mousedown', '.keyboard-key[data-key="ABC"]', function (event) {
        event.preventDefault();
        currentLayout = 'normal'; 
        updateKeyboardLayout();
    });


    $(document).on('click', '.keyboard-key[data-keyval]', function (event) {
        // Get the 'data-key' value of the clicked div
        var keyValue = $(this).attr('data-keyval');
        var currentInput = '#' + currentInputName;
        var inputField = $(currentInput)[0];
    
        console.log(keyValue);
    
        // Check if the input field supports selection
        if (inputField.type !== 'number' && ('selectionStart' in inputField || inputField.setSelectionRange)) {
            var startPos = inputField.selectionStart;
            var endPos = inputField.selectionEnd;
            var inputVal = inputField.value;
    
            // Update the value with the key value inserted at the cursor's position
            inputField.value = inputVal.substring(0, startPos) + keyValue + inputVal.substring(endPos);
    
            // Move the cursor to right after the inserted value
            var cursorPos = startPos + keyValue.length;
            inputField.selectionStart = cursorPos;
            inputField.selectionEnd = cursorPos;
        } else {
            // For input types that do not support selectionStart and selectionEnd
            // Simply append the keyValue. This is a fallback and may not fully achieve desired behavior for all input types.
            inputField.value += keyValue;
        }
    
        // Focus on the input field after inserting the value
        inputField.focus();
    });
    

    // Funzione per la gestione del tasto per il layout della tastiera
    $(document).on('click', '.keyboard-key[data-key="layout"]', function (event) {
        event.stopPropagation();
        $('#languageModal').modal('show');
    });
    
    $(document).on('click', '.language-option', function () {
        var selectedLanguage = $(this).data('value');
        if (selectedLanguage !== currentLanguage) {
            currentLanguage = selectedLanguage;
            updateKeyboardLayout();
        }
        $('#languageModal').modal('hide');
    }); 

    // Funzione per la gestione del tasto per la chiusura della tastiera.
    $(document).on('mousedown', '.keyboard-key[data-key="close-keyboard"]', function (event) {
        event.stopPropagation();
        $('#' + currentInputName).blur();
        $('#keyboard-container').hide();
    });

});
