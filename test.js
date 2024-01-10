async function test(){
	
	const text = process.argv[1]	

	const classesList = [
		{"code": 50, "group": { "code": 60 } },
		{"code": 100, "group": { "code": 200 } },
		{"code": 500, "group": { "code": 750 } }
	]

	const code = classesList.filter(obj => (obj.code).includes(text));
	
	console.log(code)

}

test()