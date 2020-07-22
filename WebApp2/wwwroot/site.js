const uri = "api/GTP";
let todos = null;
function getCount(data) {
    const el = $("#counter");
    let name = "gtp";
    if (data) {
        if (data > 1) {
            name = "gtps";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
});

function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#todos");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr class = '"+item.ID+"'></tr>")
                    .append($("<td></td>").append(
                        $("<a href='https://raw.githubusercontent.com/nordicmaster/guitarpros/master/" + item.ID + ".gp5' download = '{{item.ID}} ({{item.name}})' >" + item.ID+"</a>")))
                    .append($("<td></td>").text(item.name))
                    .append($("<td></td>").text(item.created_date))
                    .append($("<td></td>").text(item.last_modified_date))
                    .append($("<td></td>").text(item.version))
                    .append($("<td></td>").text(item.instruments_count))
                    .append($("<td></td>").text(item.track_count))
                    .append($("<td></td>").text(item.tacts))
                    .append($("<td></td>").text(item.tempo))
                    .append($("<td></td>").text(item.tonality))
                    .append($("<td></td>").html(item.signature.includes("triplets") ? item.signature[0] +'<br><div style="background-color: yellow;">triplets<div>' : item.signature))
                    .append($("<td></td>").text(item.length))
                    .append(
                        $("<td></td>").append(
                            $("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.finished
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.lyric_finished
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.recorded
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Edit</button>").on("click", function () {
                                editItem(item.ID);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>Delete</button>").on("click", function () {
                                deleteItem(item.ID);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>GET_TEXT</button>").on("click", function () {
                                get_text(item.ID);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                            $("<button>GET_STRUCTURE</button>").on("click", function () {
                                get_structure(item.ID);
                            })
                        )
                    );

                tr.appendTo(tBody);
            });
            tBody.append(
                $("<p></p>").append(
                    $("<button>API</button>").on("click", function () {
                        apii();
                    })
                )
            );
            todos = data;
        }
    });
}

function get_text(id) {
    fetch('https://nordicmaster.github.io/src/' + id + '.txt')
        .then((response) => {
            console.log(response);
            response.text().then((data) => {
                console.log(JSON.stringify(data).trim().replace(/\\n+/g, "\n"));
                var element = document.getElementsByClassName(id)[0];
                element.innerHTML += "<td><p>" + JSON.stringify(data).trim().replace(/\\n+/g, "\n")+"</p></td>";
            });
        });
}

function get_structure(id) {
    fetch('https://nordicmaster.github.io/src/structure/' + id + '.txt')
        .then((response) => {
            console.log(response);
            response.text().then((data) => {
                console.log(JSON.stringify(data).trim().replace(/\\n+/g, "\n"));
                var element = document.getElementsByClassName(id)[0];
                element.innerHTML += "<td><p>" + JSON.stringify(data).trim().replace(/\\n+/g, "\n") + "</p></td>";
            });
        });
}

function sort_em(param) {
    alert(param);
}

async function apii() {    
    //makeCorsRequest();
    //const response = await 
    fetch('https://cors-anywhere.herokuapp.com/https://gturnquist-quoters.cfapps.io/api/random')
        .then((response) => {
        console.log(response);
        response.json().then((data) => {
            alert(JSON.stringify(data));
        });
    });
    //const myJson = response.text();
    //alert(myJson);
}
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

// Make the actual CORS request.
function makeCorsRequest() {
    // This is a sample server that supports CORS.
    var url = 'https://cors-anywhere.herokuapp.com/https://joke-api-strict-cors.appspot.com/jokes/random';

    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
        alert('CORS not supported');
        return;
    }

    // Response handlers.
    xhr.onload = function () {
        var text = xhr.responseText;
        alert('Response from CORS request to ' + url + ': ' + text);
    };

    xhr.onerror = function () {
        alert('Woops, there was an error making the request.');
    };

    xhr.send();
}


function addItem() {
    const item = {
        ID: $("#add-name").val(),
        name: $("#add-name").val(),
        created_date: new Date().getDate() + '.' + new Date().getMonth() + 1 + '.' + new Date().getFullYear(),
        last_modified_date: new Date().getDate() + '.' + new Date().getMonth()+1 + '.' + new Date().getFullYear(),
        version: 1,
        instruments_count: 1,
        track_count: 1,
        tacts: 1,
        tempo: 120,
        signature: "4/4",
        tonality: "A major"
    };

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.ID === id) {
            $("#edit-name").val(item.name);
            $("#edit-id").val(item.ID);
            $("#edit-created").val(item.created_date);
            $("#edit-modified").val(item.last_modified_date);
            $("#edit-version").val(item.version);
            $("#edit-instr").val(item.instruments_count);
            $("#edit-tracks").val(item.track_count);
            $("#edit-tacts").val(item.tacts);
            $("#edit-tempo").val(item.tempo);
            $("#edit-tonality").val(item.tonality);
            $("#edit-signature").val(item.signature);
            $("#edit-finished")[0].checked = item.finished;
            $("#edit-lyric")[0].checked = item.lyric_finished;
            $("#edit-recorded")[0].checked = item.recorded;            
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        ID: $("#edit-id").val(),
        name: $("#edit-name").val(),
        created_date: $("#edit-created").val(),
        last_modified_date: $("#edit-modified").val(),
        version: $("#edit-version").val(),
        instruments_count: $("#edit-instr").val(),
        track_count: $("#edit-tracks").val(),
        tacts: $("#edit-tacts").val(),
        tempo: $("#edit-tempo").val(),
        tonality: $("#edit-tonality").val(),
        signature: $("#edit-signature").val(),
        finished: $("#edit-finished").is(":checked"),
        lyric_finished: $("#edit-lyric").is(":checked"),
        recorded: $("#edit-recorded").is(":checked")
    };

    $.ajax({
        url: uri + "/" + $("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
}
