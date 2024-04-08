document.addEventListener("DOMContentLoaded", () => {

    // Preferences modal
    
    // Set Divine Name button
    if (localStorage.dn === "god" || !localStorage.dn) {
        document.querySelector(".divine-name.option-1").classList.add("active")
    } else if (localStorage.dn === "the-holy-one") {
        document.querySelector(".divine-name.option-2").classList.add("active")
    } else if (localStorage.dn === "tetra-latin") {
        document.querySelector(".divine-name.option-3").classList.add("active")
    } else if (localStorage.dn === "tetra-hebrew") {
        document.querySelector(".divine-name.option-4").classList.add("active")
    }

    // Set pronouns button
    if (localStorage.pn === "god" || !localStorage.pn) {
        document.querySelector(".third-person-pronouns.option-1").classList.add("active")
    } else if (localStorage.pn === "they-them") {
        document.querySelector(".third-person-pronouns.option-2").classList.add("active")
    }

    // Set king button
    if (localStorage.king === "historical" || !localStorage.pn) {
        document.querySelector(".king.option-1").classList.add("active")
    } else if (localStorage.king === "messianic") {
        document.querySelector(".king.option-2").classList.add("active")
    } else if (localStorage.king === "neutral") {
        document.querySelector(".king.option-3").classList.add("active")
    }
    
    // Set messianic button
    if (localStorage.ms === "disabled") {
        document.querySelector(".toggle .messianic").classList.remove("active")
    }

    // Set pn caps button
    if (localStorage.pnCaps === "disabled") {
        document.querySelector(".toggle .pn-caps").classList.remove("active")
    }
    
    // Divine name listeners
    
    // God
    document.querySelector(".divine-name.option-1").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".divine-name").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".divine-name.option-1").classList.add("active")
        // Change preference
        localStorage.dn = "god";
        setDivineName(localStorage.dn)
    })
    
    // The Holy One
    document.querySelector(".divine-name.option-2").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".divine-name").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".divine-name.option-2").classList.add("active")
        // Change preference
        localStorage.dn = "the-holy-one";
        setDivineName(localStorage.dn)
    })

    // Tetragrammaton Latin
    document.querySelector(".divine-name.option-3").addEventListener("click",  () => {
        // Set buttons
        document.querySelectorAll(".divine-name").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".divine-name.option-3").classList.add("active")
        // Change preference
        localStorage.dn = "tetra-latin";
        setDivineName(localStorage.dn)
    })
    
    // Tetragrammaton Hebrew
    document.querySelector(".divine-name.option-4").addEventListener("click",  () => {
        // Set buttons
        document.querySelectorAll(".divine-name").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".divine-name.option-4").classList.add("active")
        // Change preference
        localStorage.dn = "tetra-hebrew";
        setDivineName(localStorage.dn)
    })

    // Pronoun Listeners
    
    // God
    document.querySelector(".third-person-pronouns.option-1").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".third-person-pronouns").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".third-person-pronouns.option-1").classList.add("active")
        // Change preference
        localStorage.pn = "god";
        setPronouns(localStorage.pn)
    })
    
    // They/them
    document.querySelector(".third-person-pronouns.option-2").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".third-person-pronouns").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".third-person-pronouns.option-2").classList.add("active")
        // Change preference
        localStorage.pn = "they-them";
        setPronouns(localStorage.pn)
    })
    
    // King listeners
    
    // Historical
    document.querySelector(".king.option-1").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".king").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".king.option-1").classList.add("active")
        // Change preference
        localStorage.king = "historical";
        setKing(localStorage.king)
    })
    
    // Messianic
    document.querySelector(".king.option-2").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".king").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".king.option-2").classList.add("active")
        // Change preference
        localStorage.king = "messianic";
        setKing(localStorage.king)
    })

    // Gender neutral
    document.querySelector(".king.option-3").addEventListener("click", () => {
        // Set buttons
        document.querySelectorAll(".king").forEach(element => {
            element.classList.remove("active")
        })
        document.querySelector(".king.option-3").classList.add("active")
        // Change preference
        localStorage.king = "neutral";
        setKing(localStorage.king)
    })
    
    // Other options
    
    // Messianic
    document.querySelector(".toggle .messianic").addEventListener("click", () => {
        // Set buttons
        if (document.querySelector(".toggle .messianic").classList.contains("active")) {
            document.querySelector(".toggle .messianic").classList.remove("active");
            localStorage.ms = "disabled";
        } else {
            document.querySelector(".toggle .messianic").classList.add("active");
            localStorage.ms = "enabled";
        }
        // Change preference
        setMessianic(localStorage.ms)
    })
    
    // Pronoun caps
    document.querySelector(".toggle .pn-caps").addEventListener("click", () => {
        // Set buttons
        if (document.querySelector(".toggle .pn-caps").classList.contains("active")) {
            document.querySelector(".toggle .pn-caps").classList.remove("active");
            document.querySelector(".preferences").classList.remove("pn-caps-enabled");
            localStorage.pnCaps = "disabled";
        } else {
            document.querySelector(".toggle .pn-caps").classList.add("active");
            document.querySelector(".preferences").classList.add("pn-caps-enabled");
            localStorage.pnCaps = "enabled"
        }
        // Change preference
        setPronounCaps(localStorage.pnCaps)
    })
})

export function setDivineName(option) {
    if (option === "god") {
        document.querySelectorAll(".def-l").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".def-u").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".voc").forEach(element => {
            element.innerHTML = "God";
        })
    } else if (option === "the-holy-one") {
        document.querySelectorAll(".def-l").forEach(element => {
            element.innerHTML = "the Holy&nbsp;One";
        })
        document.querySelectorAll(".def-u").forEach(element => {
            element.innerHTML = "The Holy&nbsp;One";
        })
        document.querySelectorAll(".voc").forEach(element => {
            element.innerHTML = "Holy&nbsp;One";
        })
    } else if (option === "tetra-latin") {
        document.querySelectorAll(".def-l").forEach(element => {
            element.innerHTML = "yhwh";
        })
        document.querySelectorAll(".def-u").forEach(element => {
            element.innerHTML = "yhwh";
        })
        document.querySelectorAll(".voc").forEach(element => {
            element.innerHTML = "yhwh";
        })
    } else if (option === "tetra-hebrew") {
        document.querySelectorAll(".def-l").forEach(element => {
            element.innerHTML = "&nbsp;יהוה&nbsp;";
        })
        document.querySelectorAll(".def-u").forEach(element => {
            element.innerHTML = "&nbsp;יהוה&nbsp;";
        })
        document.querySelectorAll(".voc").forEach(element => {
            element.innerHTML = "&nbsp;יהוה&nbsp;";
        })
    }
}

export function setPronouns(option) {
    if (option === "god") {
        document.querySelectorAll(".pn-s-u").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".pn-s-l").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".pn-o-u").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".pn-o-l").forEach(element => {
            element.innerHTML = "God";
        })
        document.querySelectorAll(".pn-p-u").forEach(element => {
            element.innerHTML = "God's";
        })
        document.querySelectorAll(".pn-p-l").forEach(element => {
            element.innerHTML = "God's";
        })
        document.querySelectorAll(".pos").forEach(element => {
            element.innerHTML = "God's";
        })
        document.querySelectorAll(".pn-v-s").forEach(element => {
            element.innerHTML = element.innerHTML + "s";
        })
        document.querySelectorAll(".pn-v-es").forEach(element => {
            element.innerHTML = element.innerHTML + "es";
        })
        document.querySelectorAll(".pn-v-ies").forEach(element => {
            element.innerHTML = element.innerHTML.substring(0, element.innerHTML.length - 1) + "ies";
        })
        document.querySelectorAll(".pn-v-is").forEach(element => {
            element.innerHTML = "is";
        })
        document.querySelectorAll(".pn-v-was").forEach(element => {
            element.innerHTML = "was";
        })
        document.querySelectorAll(".pn-v-has").forEach(element => {
            element.innerHTML = "has";
        })
    } else if (option === "they-them") {
        document.querySelectorAll(".pn-s-u").forEach(element => {
            element.innerHTML = "They";
        })
        document.querySelectorAll(".pn-s-l").forEach(element => {
            element.innerHTML = "they";
        })
        document.querySelectorAll(".pn-o-u").forEach(element => {
            element.innerHTML = "Them";
        })
        document.querySelectorAll(".pn-o-l").forEach(element => {
            element.innerHTML = "them";
        })
        document.querySelectorAll(".pn-p-u").forEach(element => {
            element.innerHTML = "Their";
        })
        document.querySelectorAll(".pn-p-l").forEach(element => {
            element.innerHTML = "their";
        })
        document.querySelectorAll(".pos").forEach(element => {
            element.innerHTML = "theirs";
        })
        document.querySelectorAll(".pn-v-s").forEach(element => {
            element.innerHTML = element.innerHTML.substring(0, element.innerHTML.length - 1);
        })
        document.querySelectorAll(".pn-v-es").forEach(element => {
            element.innerHTML = element.innerHTML.substring(0, element.innerHTML.length - 2);
        })
        document.querySelectorAll(".pn-v-ies").forEach(element => {
            element.innerHTML = element.innerHTML.substring(0, element.innerHTML.length - 3) + "y";
        })
        document.querySelectorAll(".pn-v-is").forEach(element => {
            element.innerHTML = "are";
        })
        document.querySelectorAll(".pn-v-was").forEach(element => {
            element.innerHTML = "were";
        })
        document.querySelectorAll(".pn-v-has").forEach(element => {
            element.innerHTML = "have";
        })
    }
}
export function setKing(option) {
    if (option === "historical") {
        document.querySelectorAll(".kg-1").forEach(element => {
            element.innerHTML = "king";
        })
        document.querySelectorAll(".kg-2").forEach(element => {
            element.innerHTML = "son";
        })
        document.querySelectorAll(".kg-3").forEach(element => {
            element.innerHTML = "daughter";
        })
        document.querySelectorAll(".kg-4").forEach(element => {
            element.innerHTML = "her";
        })
        document.querySelectorAll(".kg-5").forEach(element => {
            element.innerHTML = "She";
        })
        document.querySelectorAll(".kg-6").forEach(element => {
            element.innerHTML = "her";
        })
        document.querySelectorAll(".kg-7").forEach(element => {
            element.innerHTML = "he is";
        })
        document.querySelectorAll(".kg-8").forEach(element => {
            element.innerHTML = "him";
        })
        document.querySelectorAll(".kg-9").forEach(element => {
            element.innerHTML = "he";
        })
        document.querySelectorAll(".kg-10").forEach(element => {
            element.innerHTML = "his";
        })
        document.querySelectorAll(".kg-11").forEach(element => {
            element.innerHTML = "He";
        })
    } else if (option === "messianic") {
        document.querySelectorAll(".kg-1").forEach(element => {
            element.innerHTML = "King";
        })
        document.querySelectorAll(".kg-2").forEach(element => {
            element.innerHTML = "Son";
        })
        document.querySelectorAll(".kg-3").forEach(element => {
            element.innerHTML = "child";
        })
        document.querySelectorAll(".kg-4").forEach(element => {
            element.innerHTML = "their";
        })
        document.querySelectorAll(".kg-5").forEach(element => {
            element.innerHTML = "They";
        })
        document.querySelectorAll(".kg-6").forEach(element => {
            element.innerHTML = "them";
        })
        document.querySelectorAll(".kg-7").forEach(element => {
            element.innerHTML = "he is";
        })
        document.querySelectorAll(".kg-8").forEach(element => {
            element.innerHTML = "him";
        })
        document.querySelectorAll(".kg-9").forEach(element => {
            element.innerHTML = "he";
        })
        document.querySelectorAll(".kg-10").forEach(element => {
            element.innerHTML = "his";
        })
        document.querySelectorAll(".kg-11").forEach(element => {
            element.innerHTML = "He";
        })
    } else if (option === "neutral") {
        document.querySelectorAll(".kg-1").forEach(element => {
            element.innerHTML = "sovereign";
        })
        document.querySelectorAll(".kg-2").forEach(element => {
            element.innerHTML = "child";
        })
        document.querySelectorAll(".kg-3").forEach(element => {
            element.innerHTML = "child";
        })
        document.querySelectorAll(".kg-4").forEach(element => {
            element.innerHTML = "their";
        })
        document.querySelectorAll(".kg-5").forEach(element => {
            element.innerHTML = "They";
        })
        document.querySelectorAll(".kg-6").forEach(element => {
            element.innerHTML = "them";
        })
        document.querySelectorAll(".kg-7").forEach(element => {
            element.innerHTML = "they are";
        })
        document.querySelectorAll(".kg-8").forEach(element => {
            element.innerHTML = "them";
        })
        document.querySelectorAll(".kg-9").forEach(element => {
            element.innerHTML = "they";
        })
        document.querySelectorAll(".kg-10").forEach(element => {
            element.innerHTML = "their";
        })
        document.querySelectorAll(".kg-11").forEach(element => {
            element.innerHTML = "They";
        })
    }
}

export function setMessianic(option) {
    if (option === "enabled") {
        if (document.querySelector(".ms-1")) {
            document.querySelector(".ms-1").innerHTML = "Son of Man";
        }
        if (document.querySelector(".ms-2")) {
            document.querySelector(".ms-2").innerHTML = "no man";
        }
        if (document.querySelector(".ms-3")) {
            document.querySelector(".ms-3").innerHTML = "He";
        }
        if (document.querySelector(".ms-4")) {
            document.querySelectorAll(".ms-4").forEach(element => {
                element.innerHTML = "him";
            })
        }
        if (document.querySelector(".ms-5")) {
            document.querySelector(".ms-5").innerHTML = "Lord";
        }
    } else if (option === "disabled") {
        if (document.querySelector(".ms-1")) {
            document.querySelector(".ms-1").innerHTML = "mortal";
        }
        if (document.querySelector(".ms-2")) {
            document.querySelector(".ms-2").innerHTML = "not human";
        }
        if (document.querySelector(".ms-3")) {
            document.querySelector(".ms-3").innerHTML = "They";
        }
        if (document.querySelector(".ms-4")) {
            document.querySelectorAll(".ms-4").forEach(element => {
                element.innerHTML = "them";
            });
        }
        if (document.querySelector(".ms-5")) {
            document.querySelector(".ms-5").innerHTML = "ruler";
        }
    }
}

export function setPronounCaps(option) {
    if (option === "disabled") {
        document.querySelector(".psalm-box").classList.remove("pn-caps-enabled");
    } else {
        document.querySelector(".psalm-box").classList.add("pn-caps-enabled");
    }
}

export function setPrefs() {
    // Divine Name
    if (localStorage.dn && localStorage.dn !== "god") {
        setDivineName(localStorage.dn)
    }

    // Pronouns
    if (localStorage.pn === "they-them") {
        setPronouns(localStorage.pn)
    }
    if (localStorage.pnCaps === "disabled") {
        setPronounCaps(localStorage.pnCaps)
    }

    // King
    if (localStorage.king !== "messianic") {
        setKing(localStorage.king)
    }

    // Other options
    if (localStorage.ms === "disabled") {
        setMessianic(localStorage.ms)
    }
}