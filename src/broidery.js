var positions = [];
$(document).ready(function () {
    console.warn('Page loaded!');
    let fmsCount = 0;
    $('#alrt').css('display', 'none');
    $("#Vte").focus();
    checkCount();

    $('#btnsearch').click(function () {

        if ($('#Vte').val().length > 3) checkBroideryFlux($('#Vte').val());
        else showMessageError('EROARE: Numarul de caractere invalid! Trebuie sa fie > 3.');

        function checkBroideryFlux(input) {
            let inp = input.toUpperCase();
            if (inp.includes('VTE-')) {

                $.ajaxSetup({
                    timeout: 10000,
                    retryAfter: 20000
                });
                let params = '',
                    machine = '';

                if (window.location.hash == '#machine_1') machine = '1';
                else if (window.location.hash == '#machine_2') machine = '2';
                else machine = '';

                if (machine != '') {
                    if (machine == '1' || machine == '2') {
                        if (localStorage.getItem('lastVte') != null) params = "http://localhost:1880/broidery_vte?orderId=" + inp + "&brod_machine=" + machine + "&lastVte=" + localStorage.getItem('lastVte');
                        else params = "http://localhost:1880/broidery_vte?orderId=" + inp + "&brod_machine=" + machine + "&lastVte=null";

                        // if (localStorage.getItem('lastVte') != null) params = "http://172.16.102.153:1880/broidery_vte?orderId="+inp+"&brod_machine="+machine+"&lastVte="+localStorage.getItem('lastVte');
                        // else params = "http://172.16.102.153:1880/broidery_vte?orderId="+inp+"&brod_machine="+machine+"&lastVte=null";
                    

                        func = function () {
                            $.ajax({
                                url: params,
                                type: 'GET',
                                success: function (data) {
                                    console.log(params);
                                    // If text != '' or > 0 call generateData; if doesn't exist send a message

                                    if (data.TextMonograme && data.TextMonograme.length > 0) {
                                        // generateData(input);
                                        $('#imgpreview').attr('src', "data:image/png;base64, " + data.img);
                                        $('#Vte').val('');


                                        positions.push(JSON.perse(data.positionBrodery));
                                        $('#VTEid').text(inp);
                                        $('#monogramatext').text(data.TextMonograme);
                                        $('#color').text(data.color);
                                        if(data.positionBrodery?.length) $('#position').text(positions);
                                        else $('#position').text("-");
                                        $('.tableInfo').css('display', 'block');

                                        $('#imgPos').attr('src', ".src/img-pos/" + data.positionBrodery + ".jpg");
                                        $('#imgPos').attr('alt', positions + " position");


                                        $('#fms-success-msg').html('<div class="alert alert-success" role="alert" id="successOut">Broidery of <strong>' + inp + '</strong> was successfully created! Monograme: <strong>' + data.TextMonograme + '</strong>, color: <strong>' + data.color + '</strong></div>')
                                        localStorage.setItem('lastVte', inp)

                                        if (fmsCount >= 1 || localStorage.getItem('howMany') != null) fmsCount = fmsCount + 1;
                                        else fmsCount = Number(localStorage.getItem('howMany')) + 1;
                                        
                                        if (localStorage.getItem('howMany') == null) localStorage.setItem('howMany', fmsCount.toString());
                                        else {
                                            localStorage.setItem('howMany', fmsCount.toString());
                                        }
                                        checkCount();
                                        $('#alrt').css('display', 'none');
                                    }
                                    else {
                                        if (data.error == true) {
                                            showMessageError(`ERROR: This ${inp} is invalid.`);
                                        } else showMessageError(`ERROR: This ${inp} have no monograme text.`);

                                        $('#Vte').val('');

                                    }


                                },
                                error: function (e) {

                                    showMessageError('ERORR: There are no connection to the internet or server.');
                                    setTimeout(func(), ajaxSetup().retryAfter);
                                }
                            })
                        }
                        func();
                    }
                    else showMessageError('EROARE: Select broidery machine! Type in: url:/#machine_1 or url:/#machine_2');
                }
                else showMessageError('EROARE: Select broidery machine! Type in: url:/#machine_1 or url:/#machine_2');
            }
            else {
                console.log(input);
                showMessageError('ERORR: VTE invalid.');
                $('#Vte').val('');
            }
        }
        function showMessageError(message) {
            $('#alrt').css('display', 'block');
            $('#alrt').text(message);

            $('#successOut').css('display', 'none')
        }

    });

    function checkCount() {
        let data = new Date();
        let h = data.getHours();

        if (h >= 6) {
            if (localStorage.getItem('howMany') != null) {
                $('#fms-how-many').html('<button class="fms-count"><strong>' + localStorage.getItem('howMany') + '</strong></button>')
                $('#fms-how-many').css('display', 'inline-block');
            }
            else $('#fms-how-many').css('display', 'none');
        }
    }

    window.onbeforeunload = function (event) {
        var message = 'Important: Please click on \'Save\' button to leave this page.';
        if (typeof event == 'undefined') {
            event = window.event;
        }
        if (event) {
            event.returnValue = message;
        }
        return message;
    };

    $(function () {
        localStorage.clear();
        window.onbeforeunload = null;
    });


    $(document).keypress(function (e) {
        let keyCode = (e.keyCode ? e.keyCode : e.which)
        if (keyCode == '13') {
            $('#btnsearch').click();
        }
    })
    $('#broidery_machine').on('click', function () {
        localStorage.setItem('brod', $('#broidery_machine').val())
    })

})



/*
@ UPDATES **
[14 oct 2022]
- adaugat scanere la PC-urile pentru broderie.
- daca un VTE exista deja in masina de broderit si este rescanat; acesta nu va fi rescris (va aparea doar textul; se intampla rar dar cauza unele BUG-uri)
    * nu va mai putea fi scanat.
- rescris modul cum se aleg masinile de broderit.
- daca un text nu are monograma; nu il va mai incarca in masina.
- adaugate node.status pentru node red; de observat mai usor cum trec datele de la VTE.
- scos VTE- de la inceputul fisierului. Nu se observa bine pe masina de broiderie.
- in cazul in care nu este masina selectata corect, apare un mesaj informativ.
- se face focus automat pe input.
- adaugat mesaj de confirmre atunci cand broderia a fost generata cu succes! 

[17. oct 2022]
- reparare buguri minore
- adaugate count pentru fiecare PC; sa stie cate dosare au scanat.

[18 oct 2022]
- Info: adaugata culoarea broderiei.


*/