let vteId = "";
let lastItemScanned;
let statusScann = false;
let submitBtn = false;
$(document).ready(function () {
    let html5qrcode = new Html5Qrcode("qr-reader", {
        // Use this flag to turn on the feature.
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
        },
        rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_39],


    });

    console.warn("Page loaded!")
    function onScanSuccess(decodedText, decodedResult) {
        if (lastItemScanned != decodedText) {

            lastItemScanned = decodedText;
            vteId = lastItemScanned;

            checkDataFrom__();
            alert(`Scan result ${decodedText}`, decodedResult);
        } 

    }
    const scanConfig = { fps: 1, qrbox: 600 };
    // If you want to prefer front camera

    if (statusScann) {
        statusScann = false;
        disableScanning();
    } else {
        html5qrcode.start({ facingMode: "environment" }, scanConfig, onScanSuccess);
    }

    let vte_name = '';
    function checkDataFrom__() {

        if (vteId.length > 0) 
        {
            $('#searchbar').val(vteId);
            alert("checkDataFrom_ called");
            alert(`VTE ${vteId} in ${$('#searchbar').val()}`)
            // submitBtn = true;
            TakeDataFromNode($('#searchbar').val());
            // vte_name = $('#searchbar').val();
            disableScanning();
        }
        // if(submitBtn == true) vte_name = $('#searchbar').val();
        disableScanning();
    }

    function TakeDataFromNode(input) {
        $('#btnsearch').click(function () {
            // let params = "http://127.0.0.1:1880/broidery_vte?v="+decodedText;
            let params = "https://node.formens.ro/broidery_vte?v=" + input
            fetch(params)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    alert(data)
                })

            // alert("btn was clicked")
            $('#searchbar').val("");
            lastItemScanned = '';
            vteId = "";
            statusScann = false;
            submitBtn = false;
        })
    }


    const disableScanning = () => {
        html5QrCode.stop();
        html5QrCode.clear().then(_ => {
            // the UI should be cleared here      
        }).catch(error => {
            // Could not stop scanning for reasons specified in `error`.
            // This conditions should ideally not happen.
        });
    }
});

