function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; SameSite=Lax;";
	console.log(document.cookie);
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function init_events() {

	// Color invert switch

	const sw_ics = document.getElementsByClassName("invertcolor");
	const hes = document.getElementsByTagName("html");	
	let sw_ic;
	if (hes.length < 1) {
		throw new Error("Color invert switch - no HTML element");
	}

	const cook_val = getCookie("inverted_colors");
	let curr_inverted = hes[0].classList.contains("inverted");

	if (cook_val=="true") {
		if (!curr_inverted) {
			setCookie("inverted_colors","true",1);
			hes[0].classList.add("inverted");
			curr_inverted = true;
		}
	} else {
		hes[0].classList.remove("inverted");
		curr_inverted = false;
	}

	for (let i=0; i<sw_ics.length; i++) {
		sw_ic = sw_ics[i];
		sw_ic.checked = curr_inverted;
		(function(p_sw_ic, p_hes) {
			p_sw_ic.addEventListener('click', function(ev) {
				const curr_inverted = p_hes.classList.contains("inverted");
				if (this.checked) {
					if (!curr_inverted) {
						setCookie("inverted_colors","true",1);
						p_hes.classList.add("inverted");
					}
				} else {
					if (curr_inverted) {
						setCookie("inverted_colors","false",1);
					}
					p_hes.classList.remove("inverted");
				}
			});
		})(sw_ic, hes[0]);
	}
}


init_events();