const express = require("express")
const {response} = require("express");
const Todo = require("./models/todoList")

const path = require('path');
const app = express()


app.use(express.json());
mongoose = require("mongoose");


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Hello World!')

})
app.get("/api/todos", async (req, res) =>{
    console.log("todo loading...")
    const todo = await Todo.find({})
    res.json(todo);
})

app.patch('/api/todos/:id/isDone', async (req, res) => {
    const id = parseInt(req.params.id);
    const { isDone } = req.body;

    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        {isDone:isDone},
        {new : true}
    )
    if (!todo) {
        return res.status(404).json({ message: 'Todo item not found.' });
    }

    res.json(todo)
})

app.patch('/api/todos/:id/text', async (req, res) => {
    const id = parseInt(req.params.id);
    const { todoText } = req.body;

    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        {todoText:todoText},
        {new : true}
    )
    if (!todo) {
        return res.status(404).json({ message: 'Todo item not found.' });
    }

    res.json(todo)
})

app.delete('/api/todos/:id', async (req, res) => {

    const todo = await Todo.findByIdAndDelete(
        req.params.id
    )
    if (!todo) {
        return res.status(404).json({ message: 'Todo item not found.' });
    }
    res.status(204).send();
})
app.post('/api/todos', async (req, res) =>{
    const { todoText } = req.body;
    const todo = await Todo.create({todoText:todoText, isDone:false})
    console.log(`created item ${res}`)
    res.json(todo)
})

app.get('/test', (req, res) => {
    res.send('Hello World 2!')
})

url = 'mongodb+srv://demo:root@cluster0.up1yn7o.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000
});
if (require.main === module) {
    console.log("local run")
    mongoose.connection.once("open", () => {
        console.log("🚀 Connected to mongodb!")
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            // This log confirms which port the server is running on
            console.log(`Server is running on port ${PORT}`);
        });
    })
}else{
    console.log("exporting run")
    module.exports = app;
}
main().catch(err => console.log(err));

async function main() {
    //await mongoose.connect('mongodb://127.0.0.1:27017/test');
    /*url = 'mongodb+srv://demo:root@cluster0.up1yn7o.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0'
    await mongoose.connect(url, {
        serverSelectionTimeoutMS: 5000
    });*/
    console.log("🚀 Connected to mongodb!")

    const PORT = process.env.PORT || 3000;

/*app.listen(PORT, () => {
    // This log confirms which port the server is running on
    console.log(`Server is running on port ${PORT}`);
});*/

}

