<script setup>
  import { reactive, onMounted, computed } from 'vue';
  import DB from '@/services/DB';
  import TodoListAddForm from './TodoListAddForm.vue';
  import TodoListFooter from './TodoListFooter.vue';
  import Todo from './Todo.vue';

  const props = defineProps({
    apiURL: { type: String, required: true },
  });

  const todos = reactive([]);

  const notCompletedCount = computed(
    () => todos.filter(todo => !todo.completed).length
  );

  // onMounted quand des objets sont créés dans le DOM, on prend le tableau todos et on y met le résultat de la transaction ajax pour chercher les todos dans l'API
  // On intervient quand les éléments (todos) sont créés dans le DOM, on y met les infos de la DB
  onMounted(async () => {
    DB.setApiURL(props.apiURL);
    // Quand on a déclaré todos c'est une constante, on le splice en tableau, todos.length = là où on commence à ajouter/enlever des éléments (= 0), 0 = on remplace 0 éléments, ... = syntaxe splice "spread", on remplace ce qu'il y a dans todos par les infos de la DB (findAll), ... = vient d'une fonction
    todos.splice(todos.length, 0, ...(await DB.findAll()));
    // console.table(todos);
  });

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
</script>

<template>
    <!-- CARD LISTE -->
    <section class="bg-slate-100 rounded-xl shadow ring-1 ring-slate-200/60 overflow-hidden"
      aria-labelledby="todo-heading">
      <h2 id="todo-heading" class="sr-only">Todo list</h2>

      <!-- INPUT PRINCIPAL -->
      <TodoListAddForm @on-submit-add-form="createItem($event)" />

      <!-- LISTE DES TODOS -->
      <ul
        class="m-4 divide-y divide-slate-200 text-slate-600"
        role="list"
        aria-label="Todos"
      >
        <!-- ITEM (exemple) -->
        <todo
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @on-delete="deleteOneById($event)"
        />
        <!-- ($event) ou rien sans parenthèses -->
      </ul>

      <!-- FOOTER DE LISTE -->
      <TodoListFooter :notCompletedCount="notCompletedCount" />
    </section>
</template>

<style scoped></style>