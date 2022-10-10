
$(document).ready(function () {
    let vteId = "";
    let lastItemScanned;
    let statusScann = false;

    console.warn("Page loaded!")
    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Scan result ${decodedText}`, decodedResult);
        vteId = decodedText;
        if (vteId != lastItemScanned) {
            if ($('#searchbar').val().length <= 0) {
                if(statusScann == false){    
                    $('#searchbar').val(vteId)
                    lastItemScanned = vteId;
                    alert(decodedText)
                    checkDataFrom__();
                    html5qrcode.stop();
                }
            }
        
        } else {
            statusScann = false;
            alert(`You already scanned this VTE! ${lastItemScanned} VTE ${vteId}`)
        }
        // console.log('decodedText:', decodedText);
    }
    let html5qrcode = new Html5Qrcode("qr-reader", {
        // Use this flag to turn on the feature.
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
        },
        rememberLastUsedCamera: true,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_39],


    });
    const scanConfig = { fps: 1, qrbox: 600 };
    // If you want to prefer front camera


    if (statusScann) {
        statusScann = false;
        html5qrcode.stop();
        html5qrcode.clear();
    } else {
        html5qrcode.start({ facingMode: "environment" }, scanConfig, onScanSuccess);
    }


    function checkDataFrom__() {

        if (vteId.length > 0 && vteId != "") 
        {
            if($('#searchbar').val().length > 0) 
            {
                $('#searchbar').val(vteId);
                alert("checkDataFrom_ called");
                alert(`VTE ${vteId} in ${takeValFromInput}`)
                TakeDataFromNode(vteId)
                $('#btnsearch').click();
            }
        }
    }



    function TakeDataFromNode(input) {
        $('#btnsearch').on('click', function () {
            alert("btn was clicked")
            $('#searchbar').val("");
            vteId = "";
            statusScann = false;
            // let params = "http://127.0.0.1:1880/broidery_vte?v="+decodedText;
            let params = "https://node.formens.ro/broidery_vte?v=" + input
            fetch(params)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    alert(data)
                })
        })

    }

});

