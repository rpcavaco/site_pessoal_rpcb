
function getRandomInt(p_min, p_max) {
	const delta = Math.abs(p_max - p_min);
	return Math.floor(p_min + (Math.random() * delta));
}

function genDrop(p_groupelem, p_mincrd, p_maxcrd, p_minrad, p_maxrad, p_stroke) {
	
	let ce, an;

	const r = getRandomInt(p_minrad, p_maxrad);
	ce = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	ce.setAttribute("cx", getRandomInt(p_mincrd, p_maxcrd));
	ce.setAttribute("cy", getRandomInt(p_mincrd, p_maxcrd));
	ce.setAttribute("r", "1");
	ce.setAttribute("fill", "none");
	ce.setAttribute("stroke", p_stroke);
	ce.setAttribute("stroke-width", "1");

	an = document.createElementNS("http://www.w3.org/2000/svg", "animate");
	an.setAttribute("attributeName", "r");
	values = "0;"+r.toString();
	an.setAttribute("values", values);
	an.setAttribute("dur", "3s")

	ce.appendChild(an);
	p_groupelem.appendChild(ce);

}

function init_artwork(p_mincrd, p_maxcrd, p_minrad, p_maxrad, p_stroke, p_newdrop_interval) {
	
	const gengroup = document.getElementById("gen");
	if (gengroup == null) {
		return;
	}

	(function(p_groupelem, p_mincrd, p_maxcrd, p_minrad, p_maxrad, p_stroke) {
		window.setInterval(function() {
			genDrop(p_groupelem, p_mincrd, p_maxcrd, p_minrad, p_maxrad, p_stroke);
		}, p_newdrop_interval);
	})(gengroup, p_mincrd, p_maxcrd, p_minrad, p_maxrad, p_stroke, p_newdrop_interval);

}

/*(function() {
	init_artwork(8, 360, 50, 120, "cyan", 2000);
})();
*/

class Drop {

	constructor(p_groupelem, p_width, p_height, p_maxrad, p_stepval, p_stropac_step) {

		this.maxrad = p_maxrad;
		this.r = 1;
		this.stroke_opac = 1;
		this.previousTimeStamp = null;
		this.start = null;
		this.stepval = p_stepval;
		this.stropac_step = p_stropac_step;

		this.ce = document.createElementNS("http://www.w3.org/2000/svg", "circle");

		const minx = - 20;
		const maxx = p_width + 20;
		const miny = - 20;
		const maxy = p_height + 20;

		this.ce.setAttribute("cx", getRandomInt(minx, maxx));
		this.ce.setAttribute("cy", getRandomInt(miny, maxy));
		this.ce.setAttribute("r", this.r);
		this.ce.setAttribute("fill", "none");
		this.ce.setAttribute("stroke", this.strokeval);
		this.ce.setAttribute("stroke-width", 1.2);
	
		p_groupelem.appendChild(this.ce);
		this.step = this.step.bind(this); 

		this.req = window.requestAnimationFrame(this.step);
	}
	step(p_ts) {

		if (this.ce == null) {
			throw new Error("dom element not inited");
		}

		this.started = true;
		
		if (this.start == null) {
			this.start = p_ts;
		}
		if (this.previousTimeStamp !== p_ts) {
			this.r = this.r + this.stepval;
			this.stroke_opac = this.stroke_opac - this.stropac_step;
			this.ce.setAttribute("r", this.r);
			this.ce.setAttribute("stroke-opacity", this.stroke_opac);
		}

		if (this.r < this.maxrad) {
			this.previousTimeStamp = p_ts;
			this.req = window.requestAnimationFrame(this.step);
		} else {
			window.cancelAnimationFrame(this.req);
			this.ce.parentNode.removeChild(this.ce);
			this.ce = null;

		}
		
	}
	get ended() {
		let ret = false;
		if (this.started && this.ce == null) {
			ret = true;
		}
		return ret;
	}
	get strokeval() {
		let stroke_val;
		if (document.getElementsByTagName("html")[0].classList.contains("inverted")) {
			stroke_val ="rgb(216, 215, 215)";
		} else {

			stroke_val = "rgb(40, 40, 40)";
		}	
		return stroke_val;
	}
}

class DropAnimatorClass {
	constructor(p_grp_id, p_width, p_height, p_maxrad, p_stepval, p_cleanup_millis, p_stropac_step) {
		const gengroup = document.getElementById(p_grp_id);
		if (gengroup == null) {
			throw new Error("missing group element");
		}
		this.attribs = [gengroup, p_width, p_height, p_maxrad, p_stepval, p_stropac_step];
	
		this.drops = [new Drop(...this.attribs)];
		this.nextdropstep = this.nextdropstep.bind(this);
		
		window.setInterval(this.nextdropstep, p_cleanup_millis); 


	}
	nextdropstep() {
		this.drops.push(new Drop(...this.attribs));
		for (let i=this.drops.length-1; i>=0; i--) {
			if (this.drops[i].ended) {
				this.drops.splice(-1);
			}
		}
	}

};

var DropAnimator = null;

(function() {
	const radius_step = 0.3;
	const nextdropstep_millis = 400;
	const stroke_opac_step = 0.002;
	const widths = calcDims();
	const width = widths[0];
	const height = 300;
	const maxradius = 180;

	DropAnimator = new DropAnimatorClass("gen", width, height, maxradius, radius_step, nextdropstep_millis, stroke_opac_step);
})();




