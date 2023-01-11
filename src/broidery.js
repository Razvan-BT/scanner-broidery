var positions = [], commentsHTML = "";

$('#seeDosar').hide();
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
            if(inp.startsWith('HTTPS')) inp = inp.replace('HTTPS://NODE.FORMENS.RO/Q/', '');   
            if (inp.includes('VTE-')) {
                
                let params = '',
                    machine = '';

                if (window.location.hash == '#machine_1') machine = '1';
                else if (window.location.hash == '#machine_2') machine = '2';
                else if (window.location.hash == '#machine_3') machine = '3';
                else if (window.location.hash == '#machine_4') machine = '4';
                else machine = '';

                if (machine != '') {
                    if (machine == '1' || machine == '2' || machine == '3' || machine == '4') {
                        var hosted = 'http://172.16.102.153:1880';
                        // var hosted = 'http://localhost:1880';
                        if (localStorage.getItem('lastVte') != null) params = hosted + "/broidery_vte?orderId=" + inp + "&brod_machine=" + machine + "&lastVte=" + localStorage.getItem('lastVte');
                        else params = hosted + "/broidery_vte?orderId=" + inp + "&brod_machine=" + machine + "&lastVte=null";

                        func = function () {
                            $.ajax({
                                url: params,
                                type: 'GET',
                                success: function (data) {
                                    console.log(params);
                                    if (data.TextMonograme && data.TextMonograme.length > 0) {
                                        // generateData(input);
                                        if(data.delor == 0)  { 
                                            $('#imgpreview').attr('src', "data:image/png;base64, " + data.img);
                                            $('#ifDelor').hide();
                                            $('#imgpreview').show();
                                        }
                                        else {
                                            $('#imgpreview').hide();
                                            $('#ifDelor').text("DELOR");
                                            $('#ifDelor').show();
                                        }
                                        $('#Vte').val('');

                                        // Apar datele daca VTE-ul este valid.
                                        $('.tableInfo').show();
                                        $('.comments').show();
                                        $('#seeDosar').show();
                                        
                                        // Extragere commentarii
                                        let comm = [];
                                        for (const [key, value] of Object.entries(data.comments)) {
                                            // for (let c = 0; c < Object.values(data.comments).length; c++) {
                                            comm = value;
                                            if (key.length > 0) {
                                                $('.comments').css('display', 'block');
                                                comments = '<p>' + `${Object.values(comm)}` + '</p>';
                                                $('#output_comments').append(comments);
                                                comments = "";

                                                commentsHTML = commentsHTML.concat(`
                                                    <p>${Object.values(comm)}</p>
                                                `)
                                            } else {
                                                $('.comments').css('display', 'none');
                                            }
                                        }
                                        $('.comments').html(commentsHTML);
                                        commentsHTML = "";
                                        
                                        // Extragere pozitii BROD
                                        let getPosition = [];
  
                                        for (const [key, value] of Object.entries(data.positionBrodery)) {
                                            positions = value;

                                            if (key.length > 0) console.log("[POSITION FIND] " + Object.values(positions));
                                            else console.log("[POSITION NOT FIND]");

                                            getPosition.push(...[positions]);
                                        }
                                        console.log(getPosition);
                                        $('#VTEid').text(inp);
                                        $('.tableInfo').css('display', 'block');
                                        $('#seeDosar').show();
                                        let positionHTML = "";
                              
                                        for (let i = 0; i < getPosition.length; i++) {
                                            positionHTML = positionHTML.concat(
                                                `
                                                <div class="data-info">
                                                <div class="preview-img-with-pos">
                                                  <img id="imgPos" src="src/img-pos/${Object.values(getPosition[i])}.jpg"/>
                                                </div>
                                                <div class="details-about-brod">
                                                  <div id="details-brod">
                                                    <h3><strong>Position:</strong> <span id="position">${Object.values(getPosition[i])}</span></h3>
                                                    <h3><strong>Culoare:</strong> <span id="color">${data.color}</span></h3>
                                                    <h3><strong>Font:</strong> <span id="color">${data.font}</span></h3>
                                                    <h3><strong>Monograma:</strong> <span id="monogramatext">${data.TextMonograme}</span></h3>
                                                  </div>
                                                </div>
                                              </div>`
                                            )
                                        }

                                        console.log("RX: " + Object.values(getPosition));
                                        $('.tableInfo').html(positionHTML);

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
                                        } else { 
                                            showMessageError(`ERROR: This ${inp} have no monograme text.`);
                                        }

                                        $('.tableInfo').hide();
                                        $('.comments').hide();
                                        $('#seeDosar').hide();
                                        $('#imgpreview').hide();
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
                    else showMessageError('EROARE: Select broidery machine! Type in: url:/#machine_1, url:/#machine_2, /#machine_3 or url:/#machine_4');
                }
                else showMessageError('EROARE: Select broidery machine! Type in: url:/#machine_1, url:/#machine_2, /#machine_3 or url:/#machine_4');
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

[20 dec 2022]
- Reparat un bug legat de mesajele de informatii. 
    Daca va aparea un mesaj de tip ERORR sau WARN; chiar daca inainte a fost validat un VTE -> va disparea totul. 
    Acest lucru facea ca felete sa rescrie acelasi VTE pe haine chiar daca nu era valid.
- Schimbat style-ul pentru afisarea iformatiilor, acuma apare in alta metoda.
Poza + Info broderie.
- Daca este delor va aparea separat.
- Daca in caz ca va pica serverul la Wilcom > se va face manual de fete broderia (Vali a facut acest lucru)
- adaugate inca 2 masini de brodat.

*/