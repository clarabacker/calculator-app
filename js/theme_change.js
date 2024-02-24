// Function to change the site theme and save it in localStorage when a radio input is selected
function themeChange() {
    let radios = document.getElementsByName("toggle")

    Array.from(radios).forEach( radio => {
        if(radio.checked) {
            changeColours(radio.value)
            localStorage.setItem("theme", radio.value)
            return
        }
    })
}

// Upon window load, this function checks if there is a saved theme. If there is one, it selects the corresponding radio input and triggers the changeColours function to update the site colors accordingly
window.onload = () => {
    const savedTheme = localStorage.getItem("theme")
    
    if(savedTheme) {
        let radios = document.getElementsByName("toggle")
        Array.from(radios).forEach( radio => {
            if(radio.value === savedTheme) {
                radio.checked = true
                changeColours(savedTheme) 
            }
        })
    }
}

// Function to change colors based on theme
function changeColours(value) {
    switch(value) {
        case "1":
            document.documentElement.setAttribute("data-theme", "1") 
            break
        case "2":
            document.documentElement.setAttribute("data-theme", "2")
            break
        case "3":
            document.documentElement.setAttribute("data-theme", "3")
    }
}