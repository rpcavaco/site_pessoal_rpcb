

PROPORCES_LARGURA = [ 60, 24 ]; // Para exibição de em duas colunas, proporções das larguras destas
ART_MIN = 400; // calcMaxwidthSinglecol() = 660
ART_PADDING_FULLWIDTH = 24;
ART_HEIGHT = 300;
TEMAS_WIDTHS = [250, 16]; // Largura + right margin
TEMAS_HEIGHT = 200;
TEMAS_MINMAX_HEIGHT = [140, 300];
TEMAS_BOTTOMMARG = 22;
TEMAS_PADINGS = [16, 12]; // padding esquerdo e direito

/*
 Ao alterar estes valores acima, usar calcMaxwidthSinglecol() para calcular valor limite para as queries CSS media envolvendo largura, exemplo:

 	@media (max-width: 850px) {

Ver indicação 'calcMaxwidthSinglecol' na consola.		
*/

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

// Largura máxima display uma só coluna, a partir da qual é exibida a segunda col 
function calcMaxwidthSinglecol() {
	return 10 * parseInt((ART_MIN / (PROPORCES_LARGURA[0] / 100.0)) / 10);
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

	let leftwid, rightwid, dims = bodyCanvasDims();
	const mwsc = calcMaxwidthSinglecol();

	if (dims[0] > mwsc) {
		leftwid = parseInt(dims[0] * PROPORCES_LARGURA[0] / 100.0);
		rightwid = parseInt(dims[0] * PROPORCES_LARGURA[1] / 100.0);
	} else {
		leftwid = Math.min(parseInt(dims[0] - ART_PADDING_FULLWIDTH));
		rightwid = null;
	}

	console.log("calcMaxwidthSinglecol (alterar @media (max-width: ...) em CSS se necessario):", mwsc);

	return [leftwid, rightwid, dims];
	
}

function defineWidths() {

	// Alterar apenas na página inicial onde existe o "artwork"
	const artwobj = document.getElementById("artwork");
	if (artwobj == null) {
		return;
	}

	const dims = calcDims();

	let vArtworkDimWidth = dims[0];

	//const artheight = (dims[2][1] < 750 ?  Math.round(dims[2][1] * 0.4) : ART_HEIGHT);
	const artheight = ART_HEIGHT;

	artwobj.setAttribute("width", vArtworkDimWidth); 
	artwobj.setAttribute("height", artheight); 
	artwobj.setAttribute("viewBox", "0 0 "+vArtworkDimWidth+" "+artheight); 

	// Alterar largura das colunas
	const widthctrl_wdgs = ["temascontainer", "blogview", "readingsview", "fotosview"];
	const leftwid_wdgs = ["temascontainer"];
	let wdg;
	for (let wididx, i=0; i<widthctrl_wdgs.length; i++) {
		wdg = document.getElementById(widthctrl_wdgs[i]);
		if (wdg) {
			wididx = (leftwid_wdgs.indexOf(widthctrl_wdgs[i]) >= 0 ? 0 : 1)
			wdg.style.width = dims[wididx] + 'px';
		}
	}

	// Alterar disposição de altura de 'namelabel' de acordo com a largura disponível
	const nlbl_variants = ["A", "B", "C"];
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
	const divwid = Math.round(dims[0] / TEMAS_WIDTHS.reduce((a, b) => a + b, 0));
	const temawid = parseInt(dims[0] / divwid);
	const temas = document.getElementsByClassName("tema");
	const articles_height = Math.max(TEMAS_MINMAX_HEIGHT[1], dims[2][1] - artheight - 220);
	const divheight = Math.round(articles_height / TEMAS_HEIGHT);
	for (let tema, i=0; i<temas.length; i++) {
		tema = temas[i];
		tema.style.width = (temawid - 6 - TEMAS_WIDTHS[1] - TEMAS_PADINGS.reduce((a, b) => a + b, 0) ) + 'px';
		tema.style.height = Math.max(TEMAS_MINMAX_HEIGHT[0], parseInt(Math.round(articles_height / divheight) - TEMAS_BOTTOMMARG - 4)) + 'px';
	}

	const articles = document.getElementById("articles");
	if (articles) {
		articles.style.height = articles_height + 'px';
	}
	
}