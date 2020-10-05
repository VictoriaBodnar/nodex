
//exports.perimeter = (x,y) => (2*(x+y));
//exports.area = (x,y) => (x*y);
module.exports = (x,y,allback) => {

		if (x <= 0 || y <=0) {

			setTimeout(() => 

				allback(new Error("Rectangle dimension sould be greater than zero: l = " + x + " and b = " + y),
				null),
				2000);
			
		}else{

			setTimeout(() => 

				allback(null,
				{
					perimeter: () => (2*(x+y)),
					area: () => (x*y)
				}),
				2000);	
			
		}
}


