const color_list = ["black", "gray", "silver", "white", "blue", "navy", "teal", "green", "lime", "aqua", "yellow", "red", "fuchsia", "olive", "purple", "maroon"]
const white_string_bg_color = ["black", "gray", "blue", "navy", "teal", "green", "olive", "purple", "maroon"]

let string_color = "white";
let background_color = "gray";

const bg_color_select = document.getElementById("bg-color");
const string_color_select = document.getElementById("string-color");
const add_button = document.getElementById("add_button")
const target_site_table = document.getElementById("target-sites-body")


add_button.addEventListener('click', () => {
    // console.log("click button")

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let this_site_origin = new URL(tabs[0].url).origin;

        chrome.storage.local.get('target_sites', ret => {
            let arr

            if (ret.target_sites) {
                arr = ret.target_sites
            } else {
                arr = new Array()
            }
            if (!arr.includes(this_site_origin)) {
                arr.push(this_site_origin)
                chrome.storage.local.set({ 'target_sites': arr }, function () { });
            }
        })
    })
}
)



function add_color_options(elem) {
    //console.log("add_color_options");

    for (let clr of color_list) {
        let opt = document.createElement("option");
        opt.text = clr;
        opt.value = clr;
        opt.style.backgroundColor = clr;
        if (white_string_bg_color.includes(clr)) {
            opt.style.color = "white";
        } else {
            opt.style.color = "black";
        }
        elem.appendChild(opt);
    }
}

function set_element_color(elem, setting_clr) {
    elem.style.backgroundColor = setting_clr
    if (white_string_bg_color.includes(setting_clr)) {
        elem.style.color = "white";
    } else {
        elem.style.color = "black";
    }
}


document.addEventListener('DOMContentLoaded', () => {
    //console.log(" DOMContentLoaded");
    add_color_options(bg_color_select);
    add_color_options(string_color_select);

    chrome.storage.local.get(["string_color", "background_color"], event => {
        if (event.string_color) {
            string_color = event.string_color;
            //console.log("string", string_color)
        }
        if (event.background_color) {
            background_color = event.background_color;
            //console.log("bg", background_color)
        }
        bg_color_select.querySelector(`option[value=${background_color}]`).setAttribute("selected", "");
        string_color_select.querySelector(`option[value=${string_color}]`).setAttribute("selected", "");

        set_element_color(bg_color_select, background_color)
        set_element_color(string_color_select, string_color)
    })

    chrome.storage.local.get('target_sites', ret => {
        for (let a_site of ret.target_sites) {
            let a_tr = document.createElement('tr')
            let a_td = document.createElement('td')
            a_td.textContent = a_site
            a_tr.appendChild(a_td)

            a_tr.addEventListener('click', function (e) {
                const delete_table = window.confirm("delete?")
                if (delete_table) {

                    chrome.storage.local.get('target_sites', ret => {
                        const filtered = ret.target_sites.filter(x => x !== a_site)
                        chrome.storage.local.set({ 'target_sites': filtered }, function () { });
                    })
                    a_tr.remove()
                }
            })
            target_site_table.appendChild(a_tr)
        }
    })
}, false)

bg_color_select.addEventListener('change', (event) => {
    background_color = event.target.value
    //console.log("bg_color_change", background_color)
    chrome.storage.local.set(
        { "background_color": background_color }
    ).then(value => {
        //console.log("then");
        //console.log(value);
    }
    ).catch(
        (error) => {
            //console.log("error");
            //console.error(error);
        }
    )
    set_element_color(bg_color_select, background_color)
}, false)

string_color_select.addEventListener('change', (event) => {
    string_color = event.target.value
    //console.log("string_color_change", string_color)
    chrome.storage.local.set({ "string_color": string_color }, function () { });
    set_element_color(string_color_select, string_color)
}, false)



