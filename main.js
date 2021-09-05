function init() {
  document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}
  
function handleFileSelect(event) {
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}
  
function handleFileLoad(event) {
  //parse uploaded html file into dom element and replace the css styling with the modified bs_style.css
  let dom_element = new DOMParser().parseFromString(event.target.result, "text/html");

  let battlescribe_body = dom_element.querySelector(".battlescribe");
  battlescribe_body.id = "battlescribe_body"

  battlescribe_body.querySelectorAll(".rootselection,.summary").forEach(box => {
    box.id = "datasheet" + Math.random().toString(16).slice(2)
    box.addEventListener("click", () => {
        let datasheet_div = document.getElementById("selected_datasheets");
        if(box.classList.contains("selected")){
            box.classList.remove("selected");
            let datasheet_box = datasheet_div.querySelector("#"+box.id);
            datasheet_div.removeChild(datasheet_box);
        }else{
            let datasheet_div = document.getElementById("selected_datasheets");
            let box_clone = box.cloneNode(true);
            box_clone.querySelectorAll("p, th, td, h4, br").forEach(ele => {
                ele.addEventListener("click", ()=>{
                    ele.remove();
                });
            });
            datasheet_div.prepend(box_clone);
            box.classList.add("selected");
        }
    });
  });

  if(document.getElementById("battlescribe_body")){
    document.getElementById("battlescribe_list").removeChild(document.getElementById("battlescribe_body"));
  }
  document.getElementById("battlescribe_list").appendChild(battlescribe_body);
  let save_button = document.getElementById("save_btn");
  save_button.classList.remove("hidden");

  const allCSS = [...document.styleSheets]
  .map(styleSheet => {
    try {
      return [...styleSheet.cssRules]
        .map(rule => rule.cssText)
        .join('');
    } catch (e) {
      console.log('Access to stylesheet %s is denied. Ignoring...', styleSheet.href);
    }
  })
  .filter(Boolean)
  .join('\n');


  save_button.addEventListener('click', () => {
    let content = document.getElementById("selected_datasheets");
    let content_clone = content.cloneNode(true);
    content_clone.removeChild(content_clone.lastElementChild);
    content_clone.id = "output";
    let html = document.createElement("html");
    let head = document.createElement("head");
    let body = document.createElement("body");
    let bs_style = document.createElement("style");
    bs_style.innerText = allCSS;
    head.appendChild(bs_style);
    body.appendChild(content_clone);
    html.appendChild(head);
    html.appendChild(body);
    var s = new XMLSerializer();
    var str = s.serializeToString(html);

    downloadToFile(str, 'test.html', 'text/html');
  });

}

function downloadToFile(content, filename, contentType){
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(a.href);
};
  
