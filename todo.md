comment regrouper les séries entres elles ?

Ca me rends fou ce probleme de state et de repliques d'id !! Où est l'erreur ?? Il doit y avoir plusieurs refresh qui s'accumule ! C'est une erreur deja vue et bien ocnnue pourtant.

la resolution aura été d'utiliser un promise.all sur le map et d'envoyer ensuite le tout en state.

comment regrouper les séries entres elles?

id
episode
episode
episode

id => id : {}

Cela serait un tableau d'objets. Dois-je le faire à l'enregistrement du state ou bien dans la lacture ensuite?

Liste en poster de chauqe id comme initial. Puis faire une fonction de recherche dans le state s'il y a plusieurs id ?

le map => object direct ou array
