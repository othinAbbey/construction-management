const regions = [
            { value: '-- Select Region --' },
            { value: 'Western' },
            { value: 'Northern' },
            { value: 'West Nile' },
            { value: 'Eastern' }
          ];
const materials = [
            { value: '-- Select Material --' },
            { value: 'Cement' },
            { value: 'Steel' },
            { value: 'Timber' },
            { value: 'Bricks' },
            { value: 'Tiles' },
            { value: 'Paint' },
            { value: 'Sanitary Fittings' },
            { value: 'Electrical Fittings' },
            { value: 'Roofing Materials' },
            { value: 'Doors' },
            { value: 'Windows' },
            { value: 'Plumbing Materials' },
            { value: 'Glass' },
            { value: 'sand' },
            { value: 'Furniture' },
            { value: 'Flooring Materials' },
            { value: 'Ceiling Materials' },
            { value: 'Insulation Materials' },
            { value: 'Other' }
          ];
 const searchResults= [
    {Material: "sand", Region: "Western", Price: 1000, Unit: "tons", 
    Supplier:[
    {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ]   
    },
    {Material: "sand", Region: "Northern", Price: 2000, Unit: "ton",Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: `Supplier Sand 2`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "sand", Region: "West Nile", Price: 3000, Unit: "ton", Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Sand 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "sand", Region: "Eastern", Price: 4000, Unit: "ton", Supplier:[
      {Name: "Supplier Sand 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Sand 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},

    {Material: "Bricks", Region: "Western", Price: 1000, Unit: "ton", 
    Supplier:[
    {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ]
     
    },
    {Material: "Bricks", Region: "Northern", Price: 2000, Unit: "ton",
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Bricks", Region: "West Nile", Price: 3000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Bricks", Region: "Eastern", Price: 4000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},



    ///////////////////cement/////////////////////
    {Material: "Cement", Region: "Western", Price: 32000, Unit: "Bags", 
    Supplier:[
    {Name: "Wammy", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Didan", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Tarenwa Victor", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ]   
    },
    {Material: "Cement", Region: "Northern", Price: 33000, Unit: "Bags",Supplier:[
      {Name: "Atia Moses", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: `Ocora Simon`, Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Oluka John", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Cement", Region: "West Nile", Price: 34000, Unit: "Bags", Supplier:[
      {Name: "Odur David", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Ojune Simon", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Malaika Peter", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
    {Material: "Cement", Region: "Eastern", Price: 35000, Unit: "ton", Supplier:[
      {Name: "Wabudi Simon", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Omali Vincent", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Sand 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Sand 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ]},
/////////////////////////////steel/////////////////////////
    {Material: "Steel", Region: "Western", Price: 1000, Unit: "ton", 
    Supplier:[
    {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Western-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
    {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Weastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
    {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Weastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
    {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Weastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
  ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]
     
    },
     
  
    {Material: "Steel", Region: "Northern", Price: 2000, Unit: "ton",
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Northern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Northern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Northern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Northern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ], Size: [{R8:22000, }, {Y10:34000}, {Y12:36000}, {Y16:38000}, {Y18:44000}, {Y25:48000}, {Y32:55000}]},

    {Material: "Steel", Region: "West Nile", Price: 3000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "West Nile-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "West Nile-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "West Nile-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "West Nile-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ], Size: [{R8:30000, }, {Y10:2000}, {Y12:4000}, {Y16:77000}, {Y18:60000}, {Y25:55000}, {Y32:7000}]},
    {Material: "Steel", Region: "Eastern", Price: 4000, Unit: "ton", 
    Supplier:[
      {Name: "Supplier Bricks 1", Contacts: "01111111", Location: "Estern-Region 1", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]},
      {Name: "Supplier Bricks 2", Contacts: "02222222", Location: "Eastern-Region 2", Rating: 4, Reviews: ["Good", "Bad", "Great"]},
      {Name: "Supplier Bricks 3", Contacts: "03333333", Location: "Eastern-Region 3", Rating: 4, Reviews: ["sure", "hard", "Excellent"]},
      {Name: "Supplier Bricks 4", Contacts: "04444444", Location: "Eastern-Region 4", Rating: 4, Reviews: ["Good", "Bad", "Excellent"]}, 
    ], Size: [{R8:20000, }, {Y10:32000}, {Y12:35000}, {Y16:37000}, {Y18:40000}, {Y25:45000}, {Y32:50000}]},
  ]
    
  export { regions, materials, searchResults };
