const newRecipe = new Recipe({
    title: recipeData.title,
    description: recipeData.description,
    picture: recipeData.picture,
    creationDate: recipeData.creationDate,
    member: recipeData.member,
    category: recipeData.category,
    comments: [],
  });

  const savedRecipe = await newRecipe.save();

  const ingredientRecipeDocs = recipeData.ingredientRecipes.map(ir => ({
    unit: ir.unit,
    quantity: ir.quantity,
    recipes: savedRecipe._id,
    ingredient: ir.ingredient._id,
  }));

  const newIngredientRecipes = await IngredientRecipe.insertMany(ingredientRecipeDocs);

  savedRecipe.ingredientRecipes = newIngredientRecipes.map(ir => ir._id);
  await savedRecipe.save();