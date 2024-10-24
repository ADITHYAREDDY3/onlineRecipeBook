"use client";
import React, { useState } from 'react';
import { api } from '../../trpc/react';
import RecipeForm from './RecipeForm';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Grid,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface Recipe {
  id: number;
  title: string;
  ingredients: string;
  instructions: string;
  createdAt: Date;
  userId: string;
  imageUrl?: string;
}

const RecipeList: React.FC = () => {
  const { data: recipes, isLoading, error, refetch } = api.recipe.getAll.useQuery<Recipe[]>();
  const [expandedRecipeId, setExpandedRecipeId] = useState<number | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);

  const deleteRecipe = api.recipe.delete.useMutation({
    onSuccess: async () => {
      await refetch();
      setCurrentRecipe(null);
    },
  });

  const handleDelete = (id: number) => {
    deleteRecipe.mutate(id);
    handleCloseMenu();
  };

  const handleEdit = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    handleCloseMenu();
  };

  const handleCloseForm = () => {
    setCurrentRecipe(null);
  };

  const handleExpandClick = (id: number) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedRecipeId(id);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRecipeId(null);
  };

  const handleFormSuccess = async () => {
    await refetch();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Grid container spacing={2} padding={2}>
      {/* Recipe Form */}
      <Grid item xs={12} sm={4} md={3}>
        <RecipeForm 
          currentRecipe={currentRecipe}
          onSuccess={handleFormSuccess} 
          onClose={handleCloseForm} 
        />
      </Grid>

      {/* Recipe List */}
      <Grid item xs={12} sm={8} md={9}>
        <Grid container spacing={2}>
          {recipes?.map((recipe) => (
            <Grid item xs={12} key={recipe.id}>
              <Card sx={{ 
                marginBottom: 2, 
                backgroundColor: '#FFFCF3', 
                borderRadius: "15px", 
                boxShadow: 6 // Increased shadow
              }}> 
                <CardHeader
                  avatar={
                    recipe.imageUrl ? (
                      <Avatar src={recipe.imageUrl} alt={recipe.title} />
                    ) : (
                      <Avatar>{recipe.title.charAt(0)}</Avatar>
                    )
                  }
                  action={
                    <>
                      <IconButton onClick={(e) => handleMenuClick(e, recipe.id)}>
                        <MoreVertIcon sx={{ color: '#FF6F00' }} /> 
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEl}
                        open={Boolean(menuAnchorEl) && selectedRecipeId === recipe.id}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleEdit(recipe)}>Edit</MenuItem>
                        <MenuItem onClick={() => handleDelete(recipe.id)}>Delete</MenuItem>
                      </Menu>
                    </>
                  }
                  title={<Typography sx={{ color: '#FF6F00' }} variant='h5'>{recipe.title}</Typography>} 
                  subheader={<Typography sx={{ color: '#666666' }}>{recipe.createdAt.toLocaleDateString()}</Typography>} 
                />
                <CardContent>
                  <Typography variant="body2" sx={{ color: '#4A628A' }}>
                    <strong>Ingredients:</strong> {recipe.ingredients}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                  <Box flexGrow={1} />
                  <IconButton
                    onClick={() => handleExpandClick(recipe.id)}
                    aria-expanded={expandedRecipeId === recipe.id}
                    sx={{
                      transition: 'transform 0.3s ease',
                      transform: expandedRecipeId === recipe.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      color: '#FF6F00', // Match with thick orange theme
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={expandedRecipeId === recipe.id}>
                  <CardContent>
                    <Typography sx={{ color: '#4A628A' }}>
                      <strong>Instructions:</strong> {recipe.instructions}
                    </Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RecipeList;
