import { reactive, computed } from "vue";
import DB from "@/services/DB";

const todos = reactive([]);

const notCompletedCount = computed(
    () => todos.filter(todo => !todo.completed).length
);

const init = async (apiURL) => {
    DB.setApiURL(apiURL);
    todos.splice(todos.length, 0, ...(await DB.findAll()));
};

// FONCTIONS CRUD
const createItem = async (content) => {
    const todo = await DB.create(content);
    todos.push(todo);
};

// deleteOneById(id)
// event: on-delete de Todo.vue
const deleteOneById = async (id) => {
    await DB.deleteOneById(id);
    todos.splice(
        todos.findIndex((todo) => todo.id === id),
        1
    );
};

export const todosStore = reactive({
    init,
    todos,
    notCompletedCount,
    createItem,
    deleteOneById,
});