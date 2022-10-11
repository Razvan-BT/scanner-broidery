$(document).ready(function () {
    let generatedId;
    console.warn('Page loaded!');

    $('#btnsearch').click(function () {

        if ($('#Vte').val().length > 0) checkBroideryFlux($('#Vte').val());



        function checkBroideryFlux(input) {
            let link__ = "http://localhost:1880/broidery_vte?type=read-data&orderId="
            fetch(link__ + input)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data.vteId);

                    modalUpdate(data.vteId, data.MonoText, data.color, data.filePNG);
                    $('#staticBackdrop').modal('show');
                    $('#Vte').val('');
                })
        }

            function modalUpdate(id, text, color, img) {
                console.log(`ID: ${id}, text: ${text}, color: ${color}`);
                $('#id').val(id)
                $('#mono').val(text)
                $('#color').val(color)

                console.log('Image src ', img);
                generatedId = id;

                // let stringImg = img.replaceAll("\\", "/");
                if(img.length > 0) $('#imgpreview').attr('src', `${id}.png`);

                $('#print_button').click(); // generate Auto .dst file;
            }

    });


    $('#print_button').click(function () {

        console.log('WORK!');
        generateDstFile();
        function generateDstFile() {

            let link__ = "http://localhost:1880/broidery_vte?type=writefile&orderId="
            fetch(link__ + generatedId)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log('GENERATED DST: ', generatedId);
                })

        }
    })

    $('#close_button').click(function () {
        $('#staticBackdrop').modal('hide');
        generatedId = '';
    })
})