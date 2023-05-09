const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const therapists = [
    { id: 1, name: 'Therapist 1', email: 'therapist1@example.com', specialty: 'Pediatrics' },
    { id: 2, name: 'Therapist 2', email: 'therapist2@example.com', specialty: 'Neurology' },
    { id: 3, name: 'Therapist 3', email: 'therapist3@example.com', specialty: 'Orthopedics' },
];

app.get('/', (req, res) =>
{
    res.send('Welcome to TheraSphere API');
});

app.get('/api/therapists', (req, res) =>
{
    res.send(therapists);
});

app.post('/api/therapists', (req,res) =>
{
    const { error } = validateTherapist(req.body);
    if (error)
    {
        return res.status(400).send(error.details[0].message);
    }

    const therapist = {
        id: therapists.length + 1,
        name: req.body.name,
        email: req.body.email,
        specialty: req.body.specialty
    };
    therapists.push(therapist);
    res.send(therapist);
});

app.put('/api/therapists/:id', (req, res) =>
{
    const therapist = therapists.find(c => c.id === parseInt(req.params.id));
    if (!therapist) return res.status(404).send('Error 404: The therapist with the given ID was not found');

    const { error } = validateTherapist(req.body);
    if (error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    therapist.name = req.body.name;
    therapist.email = req.body.email;
    therapist.specialty = req.body.specialty;
    res.send(therapist);
});

app.delete('/api/therapists/:id', (req,res) =>
{
    const therapist = therapists.find(c => c.id === parseInt(req.params.id));
    if (!therapist) return res.status(404).send('Error 404: The therapist with the given ID was not found');

    const index = therapists.indexOf(therapist);
    therapists.splice(index, 1);

    res.send(therapist);
});

app.get('/api/therapists/:id', (req,res) =>
{
    const therapist = therapists.find(c => c.id === parseInt(req.params.id));
    if (!therapist) return res.status(404).send('Error 404: The therapist with the given ID was not found');
    res.send(therapist);
});

function validateTherapist(therapist) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        specialty: Joi.string().min(3).required()
    });

    return schema.validate(therapist);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
