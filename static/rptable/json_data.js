
const animals =["bear", "dog", "cat", "lion", "leopard", "tiger", "owl", "eagle", "puma", "zebra"];
const genders =["female", "male"];
const origins =["Colombia", "Australia", "Mexico", "United Kingdom", "New Zeland"];
const carers =["Jose", "Hilda", "Yesenia", "Jhordany","Paco","Lucky","Tobi"];
//alert('hi 2')

reserve_animals = [];
for(let i =0; i < 30000; i ++){
    let random_data = Math.round(Math.random()*100);
    let animal = animals[parseInt(random_data % animals.length)];
    random_data = Math.round(Math.random()*100);
    let gender = genders[parseInt(random_data % genders.length)];    
    random_data = Math.round(Math.random()*100);
    let origin = origins[parseInt(random_data % origins.length)];
    random_data = Math.round(Math.random()*100);
    let carer = carers[parseInt(random_data% carers.length)];
    let age = Math.round(Math.random()*100);
    reserve_animals.push({"id": i,
                          "animal": animal,
                          "gender": gender,
                          "carer": carer,
                          "origin": origin,
                          "age": age
         });
};
console.log('created data!')




