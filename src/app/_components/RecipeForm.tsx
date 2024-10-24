"use client";
import { api } from '../../trpc/react';
import { useState, useEffect } from 'react';
import { TextField, Button, Box, CircularProgress, Paper, Typography } from '@mui/material';
import type { Recipe } from './RecipeList';

interface RecipeFormProps {
  currentRecipe?: Recipe | null;
  onClose: () => void;    
  onSuccess: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ currentRecipe, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createRecipe = api.recipe.create.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      resetForm();
      onSuccess();
      onClose();
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  const updateRecipe = api.recipe.update.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      resetForm();
      onSuccess();
      onClose();
    },
    onError: () => {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (currentRecipe) {
      setTitle(currentRecipe.title || '');
      setIngredients(currentRecipe.ingredients || '');
      setInstructions(currentRecipe.instructions || '');
      setImageUrl(currentRecipe.imageUrl ?? "");
    } else {
      resetForm();
    }
  }, [currentRecipe]);

  const resetForm = () => {
    setTitle('');
    setIngredients('');
    setInstructions('');
    setImageUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    const recipeData = { title, ingredients, instructions, imageUrl };
  
    if (currentRecipe) {
      updateRecipe.mutate(
        { id: currentRecipe.id, ...recipeData },
        {
          onError: (error) => {
            console.error('Error updating recipe:', error);
            setIsLoading(false);
          },
        }
      );
    } else {
      createRecipe.mutate(recipeData, {
        onError: (error) => {
          console.error('Error creating recipe:', error);
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        padding: '20px',
      }}
    >
      <Paper 
        elevation={5}
        sx={{ 
          padding: '40px', 
          width: '100%', 
          maxWidth: { xs: '100%', sm: '500px' }, 
          borderRadius: '15px',
          backgroundColor: '#FFF9F2', // Light background
          boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{ marginBottom: '20px', textAlign: 'center', fontWeight: 'bold', color: '#FF6F00' }} // Thick orange
        >
          {currentRecipe ? 'Update Recipe' : 'Add New Recipe'}
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }} 
        >
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            label="Recipe Title"
            required
            fullWidth
            variant="outlined"
            sx={{ borderRadius: '10px' }} 
            InputLabelProps={{
              sx: { color: '#FF6F00' } 
            }}
            InputProps={{
              sx: { borderRadius: '10px' } 
            }}
          />
          <TextField
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            label="Ingredients"
            required
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            sx={{ borderRadius: '10px' }}
            InputLabelProps={{
              sx: { color: '#FF6F00' }
            }}
            InputProps={{
              sx: { borderRadius: '10px' }
            }}
          />
          <TextField
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            label="Instructions"
            required
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            sx={{ borderRadius: '10px' }}
            InputLabelProps={{
              sx: { color: '#FF6F00' }
            }}
            InputProps={{
              sx: { borderRadius: '10px' }
            }}
          />
          <TextField
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)} 
            label="Image URL"
            fullWidth
            variant="outlined"
            sx={{ borderRadius: '10px' }}
            InputLabelProps={{
              sx: { color: '#FF6F00' }
            }}
            InputProps={{
              sx: { borderRadius: '10px' }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isLoading}
              sx={{ flex: 1, backgroundColor: '#FF6F00', '&:hover': { backgroundColor: '#FF4D00' } }} // Darker orange on hover
            >
              {isLoading ? <CircularProgress size={24} /> : currentRecipe ? 'Update' : 'Add'}
            </Button>
            <Button 
              type="button" 
              onClick={() => { resetForm(); onClose(); }} 
              variant="outlined" 
              disabled={isLoading}
              sx={{ flex: 1, borderColor: '#FF6F00', color: '#FF6F00', '&:hover': { borderColor: '#FF4D00', color: '#FF4D00' } }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RecipeForm;
