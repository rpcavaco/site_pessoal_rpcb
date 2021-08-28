

PROPORCES_LARGURA = [ 60, 24 ]; // Para exibição de em duas colunas, proporções das larguras destas
ART_MIN = 400; // calcMaxwidthSinglecol() = 660
ART_PADDING_FULLWIDTH = 24;

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

function artworkDimWidth() {

	let awwidth, dims = bodyCanvasDims();
	const mwsc = calcMaxwidthSinglecol();

	if (dims[0] > mwsc) {
		awwidth = parseInt(dims[0] * PROPORCES_LARGURA[0] / 100.0);
	} else {
		awwidth = Math.min(parseInt(dims[0] - ART_PADDING_FULLWIDTH));
	}

	console.log("calcMaxwidthSinglecol (alterar @media (max-width: ...) em CSS se necessario):", mwsc);
	console.log("awwidth:", awwidth);

	return awwidth;
	
}

function dimArtwork() {

	const artwobj = document.getElementById("artwork");
	if (artwobj == null) {
		return;
	}

	let vArtworkDimWidth = artworkDimWidth();

	artwobj.setAttribute("width", vArtworkDimWidth); 
	artwobj.setAttribute("viewBox", "0 0 "+vArtworkDimWidth+" 300"); 

	let wdg = document.getElementById("temascontainer");
	if (wdg) {
		wdg.style.width = vArtworkDimWidth + 'px';
	}

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

	if (vArtworkDimWidth < 400) {
		wdg = document.getElementById("namelabel");
		if (wdg) {
		}
	}

	wdg = document.getElementById("namelabel");
	if (wdg) {
		wdg.style.width = vArtworkDimWidth + 'px';
	}

	
}