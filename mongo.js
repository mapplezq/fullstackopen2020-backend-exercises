const mongoose = require('mongoose')

if (process.argv.length < 3 ) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0-88lk9.mongodb.net/phone-book-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

const name = process.argv[3]
const number = process.argv[4]

// console.log(`type ${number} is ${typeof number}`);

const contact = new Contact({
  name: name,
  number: number,
})

contact.save().then(result => {
  console.log(`added ${result.name} ${result.number} to phonebooks`)
  // mongoose.connection.close()
})

Contact.find({})
  .then(contacts => {
    console.log('phonebook:')
    contacts.forEach(element => {
      console.log(`${element.name} ${element.number}`)
    })
    mongoose.connection.close()
  })