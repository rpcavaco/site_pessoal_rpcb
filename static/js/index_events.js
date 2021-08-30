


function init_events() {

	// dimensionar artwork
	defineWidths();

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

	window.addEventListener("resize", defineWidths);

}


init_events();