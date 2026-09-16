function toggleStyleSheet(){
    //localStorage.setItem("theme","./styles/style1.css")
    let current = localStorage.getItem("theme");
    
    console.log(current)
    if (current == "./styles/style1.css"){
        current = "./styles/style2.css"
    }
    else{
        current = "./styles/style1.css"
    }

    localStorage.setItem("theme", current)
    document.getElementById("stylesheet").setAttribute("href", current);

        
}

function load(){
    val = localStorage.getItem("theme"); 
    document.getElementById("stylesheet").setAttribute("href",val)
}


window.onload = load()