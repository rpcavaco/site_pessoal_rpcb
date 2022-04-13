

PROPORCES_LARGURA = [ 60, 28 ]; // Para exibição de em duas colunas, proporções das larguras destas
HIDDENLEFTCOL_WIDTHLIMIT = 750; // ATENÇÃO - Ao alterar, alterar também em media queries com o mesmo valor em style.css
ART_HEIGHT = 300;
TEMAS_WIDTHS = [250, 16]; // Largura + right margin
TEMAS_HEIGHT = 200;
TEMAS_MINMAX_HEIGHT = [140, 300];
TEMAS_BOTTOMMARG = 22;
TEMAS_PADINGS = [16, 12]; // padding esquerdo e direito


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; SameSite=Lax;";
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

function bodyCanvasDims() {
	let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    
    return [x, y];
}

function calcDims() {

	let artheight, leftwid, rightwid, mobile_portrait = false, dims = bodyCanvasDims();
	const mwsc = HIDDENLEFTCOL_WIDTHLIMIT;

	if (/Mobi|Android/i.test(navigator.userAgent)) {
		if (dims[1] > dims[0]) {
			mobile_portrait = true;
		}
	}

	if (dims[0] > mwsc && !mobile_portrait) {
		leftwid = parseInt(dims[0] * PROPORCES_LARGURA[0] / 100.0);
		rightwid = parseInt(dims[0] * PROPORCES_LARGURA[1] / 100.0);
	} else {
		leftwid = parseInt(dims[0] * (PROPORCES_LARGURA[0] + PROPORCES_LARGURA[1]) / 100.0);
		rightwid = null;
	} 

	if (mobile_portrait) {
		artheight = 0.85 * dims[1];
	} else {
		artheight = ART_HEIGHT;
	}

	return [leftwid, rightwid, dims, mobile_portrait, artheight];
	
}

function defineWidths() {

	// Alterar apenas na página inicial onde existe o "artwork"
	const artwobj = document.getElementById("artwork");
	if (artwobj == null) {
		return;
	}

	const dims = calcDims();
	let artheight = dims[4];
	let vArtworkDimWidth = dims[0];

	console.log("mobile_portrait:", dims[3]);

	// Se estiver em mobile_portrait
	if (dims[3]) {

		const mobile_port_tohide = ["temascontainer", "rightcol"];
		let wdg;
		for (let i=0; i<mobile_port_tohide.length; i++) {
			wdg = document.getElementById(mobile_port_tohide[i]);
			if (wdg) {
				wdg.style.display = "none";
			}
		}

		artwobj.setAttribute("width", vArtworkDimWidth); 
		artwobj.setAttribute("height", artheight + 'px'); 
		artwobj.setAttribute("viewBox", "0 0 "+vArtworkDimWidth+" "+artheight); 

		const wdgs = document.getElementsByTagName("html");
		if (wdgs.length > 0) {
			wdgs[0].style.fontSize = '24px';
		}

		wdg = document.getElementById("namelabel_A");
		if (wdg) {
			wdg.setAttribute("visibility", "hidden");
		}
		wdg = document.getElementById("namelabel_D");
		if (wdg) {
			wdg.setAttribute("visibility", "visible");
		}

	} else {

		artwobj.setAttribute("width", vArtworkDimWidth); 
		artwobj.setAttribute("height", artheight); 
		artwobj.setAttribute("viewBox", "0 0 "+vArtworkDimWidth+" "+artheight); 

		// Alterar largura das colunas
		const widthctrl_wdgs = ["temascontainer", "blogview", "readingsview", "fotosview"];
		const leftwid_wdgs = ["temascontainer"];

		for (let wididx, i=0; i<widthctrl_wdgs.length; i++) {
			wdg = document.getElementById(widthctrl_wdgs[i]);
			if (wdg) {
				wididx = (leftwid_wdgs.indexOf(widthctrl_wdgs[i]) >= 0 ? 0 : 1)
				wdg.style.width = dims[wididx] + 'px';
			}
		}

		// Alterar disposição de altura de 'namelabel' de acordo com a largura disponível
		const nlbl_variants = ["A", "B", "C", "D"];
		for (let grpid, nlv, i=0; i<nlbl_variants.length; i++) {
			nlv = nlbl_variants[i];
			grpid = "namelabel_" + nlv;
			wdg = document.getElementById(grpid);
			if (wdg) {
				switch (nlv) {

					case "C":
						if (vArtworkDimWidth <= 350) {
							wdg.setAttribute("visibility", "visible");
						} else {
							wdg.setAttribute("visibility", "hidden");
						}
						break;
					
					case "B":
						if (vArtworkDimWidth > 350 && vArtworkDimWidth <= 480) {
							wdg.setAttribute("visibility", "visible");
						} else {
							wdg.setAttribute("visibility", "hidden");
						}
						break;
					
					case "A":
						if (vArtworkDimWidth > 480) {
							wdg.setAttribute("visibility", "visible");
						} else {
							wdg.setAttribute("visibility", "hidden");
						}
						break;	

				}
			}
		}

	}

	// Alterar margens horizontais
	const marginleft = parseInt(dims[2][0] * (100 - PROPORCES_LARGURA.reduce((a, b) => a + b, 0)) / 2 / 100);

	const marginsctrl_wdgs = ["indexheader", "indexfooter", "leftcol"];
	const leftonly_marginsctrl_wdgs = ["leftcol"];
	for (let i=0; i<marginsctrl_wdgs.length; i++) {
		wdg = document.getElementById(marginsctrl_wdgs[i]);
		if (wdg) {
			wdg.style.marginLeft = marginleft + 'px';
			if (leftonly_marginsctrl_wdgs.indexOf(marginsctrl_wdgs[i]) < 0) {
				wdg.style.marginRight = marginleft + 'px';
			}
		}

	}

	// Redimensionar 'temas'
	const usable_width_for_temas = vArtworkDimWidth - 18;
	let divwid = Math.round(usable_width_for_temas / TEMAS_WIDTHS.reduce((a, b) => a + b, 0));
	let temawid = parseInt(usable_width_for_temas / divwid) - TEMAS_PADINGS.reduce((a, b) => a + b, 0);
	while (temawid < TEMAS_WIDTHS[0] && divwid > 1) {
		divwid--;
		temawid = parseInt(usable_width_for_temas / divwid) - TEMAS_PADINGS.reduce((a, b) => a + b, 0);
	}

	const temas = document.getElementsByClassName("tema");
	const articles_height = Math.max(TEMAS_MINMAX_HEIGHT[1], dims[2][1] - artheight - 220);
	const divheight = Math.round(articles_height / TEMAS_HEIGHT);
	for (let tema, i=0; i<temas.length; i++) {
		tema = temas[i];
		tema.style.width = (temawid - 12) + 'px';
		tema.style.height = Math.max(TEMAS_MINMAX_HEIGHT[0], parseInt(Math.round(articles_height / divheight) - TEMAS_BOTTOMMARG - 4)) + 'px';
	}

	const articles = document.getElementById("articles");
	if (articles) {
		articles.style.height = articles_height + 'px';
	}
	
}