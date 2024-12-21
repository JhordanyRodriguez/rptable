
const animals =["bear", "dog", "cat", "lion", "leopard", "tiger", "owl", "eagle", "puma", "zebra"];
const genders =["female", "male"];
const origins =["Colombia", "Australia", "Mexico", "United Kingdom", "New Zeland"];
const carers =["Jose", "Hilda", "Jasmine", "Jhordany","Yesenia"];

reserve_animals = [];
for(let i =0; i < 20000; i ++){
    let random_data = Math.round(Math.random()*100);
    let animal = animals[parseInt(random_data % animals.length)];
    random_data = Math.round(Math.random()*100);
    let gender = genders[parseInt(random_data % genders.length)];    
    random_data = Math.round(Math.random()*100);
    let origin = origins[parseInt(random_data % origins.length)];
    random_data = Math.round(Math.random()*100);
    let carer = carers[parseInt(random_data% carers.length)];
    reserve_animals.push({"id": i,
        "animal": animal,
        "gender": gender,
        "carer": carer
         });
};
console.log('created data!')




