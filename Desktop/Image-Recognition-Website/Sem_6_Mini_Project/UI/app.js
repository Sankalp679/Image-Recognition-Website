Dropzone.autoDiscover = false;
function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5500/classify_image";
        // var url = "/api/classify_image";
        console.log(imageData);
        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            
            /*
            Below is a sample response if you have two faces in an image lets say virat and roger together.
            Most of the time if there is one person in the image you will get only one element in below array
            data = [
                {
                    class: "viral_kohli",
                    class_probability: [1.05, 12.67, 22.00, 4.5, 91.56],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                },
                {
                    class: "roder_federer",
                    class_probability: [7.02, 23.7, 52.00, 6.1, 1.62],
                    class_dictionary: {
                        lionel_messi: 0,
                        maria_sharapova: 1,
                        roger_federer: 2,
                        serena_williams: 3,
                        virat_kohli: 4
                    }
                }
            ]
            */

            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#error").show();
                return;
            }
            let celebrity = ["sharukh_khan", "salman_khan", "alia_bhat", "deepika_padukone"];
            
            let match = null;
            let bestScore = -1;

            for (let i=0; i<data.length; ++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }

            if (match) {
                console.log(match);
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();
                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary){
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let res = personName.split(" ");
                    $("#"+ res[0]).html(proabilityScore);
                }
            }
            // dz.removeFile(file);
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    const logo = document.querySelector(".navbar");

    anime({
        targets: ".display-wrapper",
        delay:2100,
        duration: 450,
        easing: "easeInOutSine",
        opacity: [0, 1],
        translateY: [100, 0],
    });

    anime({
    targets: ".display-card",
    duration: 500,
    delay: anime.stagger(450, { start: 2400 }),
    easing: "easeInOutSine",
    opacity: [0, 1],
    translateY: [100, 0],
    });

    logo.innerHTML = logo.innerText
    .split("")
    .map((char) => {
    return `<span>${char == " " ? "&nbsp;" : char}</span>`;
    })
    .join("");

    var tl = anime.timeline({
    easing: "easeOutExpo",
    duration: 200,
    });

    tl.add({
    targets: ".navbar span",
    opacity: [0, 1],
    translateY: [-20,0],
    delay: (elem, index) => 100 + index * 50,
    });

    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();
    init();
});

