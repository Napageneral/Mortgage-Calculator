var principal_slider;
var iRate_slider;
var maturity_slider;
var remaining_principal;


function setup() {
	createCanvas(windowWidth,windowHeight);

	principal_slider = createSlider(100000,800000,200000,1000);
	annual_rate_slider = createSlider(1,12,4,0.1);
	years_slider = createSlider(5,50,30,1);

	principal_input = createInput();
	annual_rate_input = createInput();
	years_input = createInput();

	principal_submit = createButton('set');
	principal_submit.mousePressed(p_set);
	annual_rate_submit = createButton('set');
	annual_rate_submit.mousePressed(r_set);
	years_submit = createButton('set');
	years_submit.mousePressed(y_set);

}

function draw() {
	background(155);

	let principal = principal_slider.value();
	let iRate = annual_rate_slider.value()/1200;
	let months = years_slider.value()*12;

	let monthly_payment = Monthly_Payment(principal, iRate, months);
	let total_paid = monthly_payment*months;

	let pvi_perc = [(principal/total_paid)*360, ((total_paid-principal)/total_paid)*360];

	Draw_Monthly_Graph(principal, iRate, months, 50, 500);
	Slider_Setup(principal, iRate, months, 50, 50, 20);
	pieChart_info(total_paid, 300, pvi_perc , 900, 175);

}

function pieChart_info(total_paid, diameter, data, x, y){
	pieChart(diameter, data, x, y);
	Print_Total_Paid(total_paid, x-100, y+6.6, 20);
}

function pieChart(diameter, data, x, y) {
	push();

	translate(x,y);
	stroke(0);
	strokeWeight(2);

  var lastAngle = 0;
  for (var i = 0; i < data.length; i++) {
		fill(204*abs(i-1), 204*i, 0);
    arc(0, 0, diameter, diameter, lastAngle, lastAngle+radians(data[i]), PIE);
    lastAngle += radians(data[i]);
  }
	pop();
}

function p_set(){
	principal = principal_input.value();
	principal_slider.value(principal);
}

function r_set(){
	rate = annual_rate_input.value();
	annual_rate_slider.value(rate);
}

function y_set(){
	year = years_input.value();
	years_slider.value(year);
}

function Slider_Setup(principal, iRate, months, x, y, size){
	xOffset = 147;
	yOffset = 15;
	textStyle(BOLD);
	Principal_Slider_Setup(principal, x+xOffset, y+yOffset, size);
	Interest_Rates_Slider_Setup(iRate , x+xOffset, y+size*1.25+yOffset, size);
	Time_Slider_Setup(months, x+xOffset, y+size*3.5+yOffset, size);
}

function Print_Total_Paid(total_amount, x, y, size){
	total_paid = Number.parseFloat(total_amount).toFixed(2);
	push();
	fill(255);
	stroke(0);
	strokeWeight(5);
	Print_Arbitrary("Total Paid:", total_paid, x, y, size, 5.5);
	pop();
}

function Print_Monthly_Payment(monthly_amount, x, y, size){
	monthly_payment = Number.parseFloat(monthly_amount).toFixed(2);
	push();
		strokeWeight(1);
		textSize(size);
		text("Monthly Payment:", x, y);
		text(monthly_payment, x+size*9, y);
	pop();
}


function Print_Arbitrary(string_text, value, x, y, size, spacing){
	push();
		strokeWeight(1);
		textSize(size);
		text(string_text, x, y);
		text(value, x+size*spacing, y);
	pop();
}

function Principal_Slider_Setup(principal, x, y, size){
	Print_Principal(principal, x, y, size);
	principal_slider.position(x-(principal_slider.width+size), y-size);
	principal_input.size(75);
	principal_input.position(x+180, y-size);
	principal_submit.position(principal_input.x + principal_input.width, y-size);
}

function Print_Principal(principal, x, y, size){
	push();
		strokeWeight(1);
		textSize(size);
		text("Principal:", x, y);
		text(principal, x+size*5, y);
	pop();
}

function Interest_Rates_Slider_Setup(iRate, x, y, size){
	Print_Interest_Rates(iRate, x, y, size);
	annual_rate_slider.position(x-(annual_rate_slider.width+size), y-size);
	annual_rate_input.size(75);
	annual_rate_input.position(x+290, y-size);
	annual_rate_submit.position(annual_rate_input.x + annual_rate_input.width, y-size);
}

function Print_Interest_Rates(iRate, x, y, size){
	push();
		annual = Number.parseFloat(iRate*1000).toFixed(4);
		monthly = Number.parseFloat(iRate*1000/12).toFixed(4);
		strokeWeight(1);
		textSize(size);
		text("Annual Interest Rate:", x, y);
		text(annual, x+size*11, y);
		text("Monthly Interest Rate:", x, y+size);
		text(monthly, x+size*11, y+size);
	pop();
}

function Time_Slider_Setup(months, x, y, size){
	Print_Time(months, x, y, size);
	years_slider.position(x-(years_slider.width+size), y-size);
	years_input.size(75);
	years_input.position(x+120, y-size+1);
	years_submit.position(years_input.x + years_input.width, y-size+1);
}

function Print_Time(months, x, y, size){
	push();
		strokeWeight(1);
		textSize(size);
		text("Years:", x, y);
		text(months/12, x+size*4, y);
		text("Months:", x, y+size);
		text(months, x+size*4, y+size);
	pop();
}

function Print_Stats(principal, iRate, months, x, y, size){
	let monthly_payment = Monthly_Payment(principal, iRate, months);
	Print_Principal(principal, x , y, size);
	Print_Interest_Rates(iRate, x, y+size, size);
	Print_Time(months, x ,y+size*3, size);
	Print_Arbitrary("Monthly Payment:", monthly_payment, x, y+size*5, size, 9);
	Print_Arbitrary("Total Paid:", monthly_payment*months, x, y+size*6, size, 5);
}

function Monthly_Payment(principal, iRate, months){
	return (principal*iRate*pow(1+iRate, months))/((pow(1+iRate, months) - 1));
}

function Draw_Monthly_Graph(principal, iRate, months, offset, graph_height){

	let res = (width-offset*2)/months;
	let remaining_principal = principal;
	let monthly_payment = Monthly_Payment(principal, iRate, months)

	graph_height = height - graph_height;

	for (var i = 1; i <= months; i++) {
		let monthly_interest = remaining_principal*iRate;
		let principal_paid = monthly_payment-monthly_interest;
		remaining_principal = remaining_principal-principal_paid;

		let percent_interest = monthly_interest/(monthly_payment);
		let percent_principal = 1-percent_interest;

		yPoint = graph_height+graph_height*percent_interest;
		yMax = graph_height;
		yMin = height-res;
		xCurrent = res*i+offset;

		strokeWeight(res/2);
		draw_line(xCurrent, yMin, xCurrent, yMax, 204, 0, 0);
		draw_line(xCurrent, yPoint, xCurrent, yMax, 0, 204, 0);
		draw_point(xCurrent, yPoint, 255, 255, 255);
	}

	xFinal = res*months+offset;
	draw_line(xFinal, yMin, xFinal, yMax, 204, 0, 0);
	draw_point(xFinal, yMax, 255, 255, 255);

	strokeWeight(res);
	draw_line(width-offset+res, yMin+res, width-offset+res, yMax-res, 0, 0, 0);
	draw_line(offset, yMin+res, offset, yMax-res, 0, 0, 0);
	draw_line(offset-res, yMax, width-offset+res*2, yMax, 0, 0, 0);
	draw_line(offset-res, yMin, width-offset+res*2, yMin, 0, 0, 0);

	push();
		translate(27.5,graph_height*1.75);
		rotate(-PI/2);
		Print_Monthly_Payment(monthly_payment, 0, 0, 20);
	pop();


}



function draw_line(xi, yi, xf, yf, r, g, b){
	push();
		stroke(r, g, b);
		line(xi, yi, xf, yf);
	pop();
}

function draw_point(x, y, r, g, b){
	push();
		stroke(r, g, b);
		point(x, y);
	pop();
}
