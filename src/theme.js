function toggleStyleSheet(){
    let current = localStorage.getItem("theme");
    localStorage.setItem("theme","./styles/style1.css")
    console.log(current)
    if (current == "./styles/style1.css"){
        let next = "./styes/style2.css"
    }
    else{
        let next = "style1.css"
    }
    localStorage.setItem("theme", current)

    document.getElementById("stylesheet").setAttribute("href", "next");

        
}

function load(){
    val = localStorage.getItem("theme"); 
    document.getElementById("stylesheet").setAttribute("href",val)
}


window.onload = load()