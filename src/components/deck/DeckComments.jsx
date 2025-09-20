import React, {useCallback, useEffect, useState} from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import {Delete as DeleteIcon, Edit as EditIcon, MoreVert as MoreVertIcon} from '@mui/icons-material';
import {useAuth} from '../../context/AuthContext';
import {toast} from 'react-toastify';
import {deleteComment, fetchDeckComments, postDeckComment, updateComment} from '../../api/deck_comment';

export default function DeckComments({deckId}) {
  const {user, isAuthenticated} = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDeckComments(deckId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Erreur lors du chargement des commentaires');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await postDeckComment(deckId, newComment.trim());
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!newContent.trim()) return;

    try {
      const updatedComment = await updateComment(commentId, newContent.trim());
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? updatedComment : comment
        )
      );
      setEditingId(null);
      setEditingContent('');
      toast.success('Commentaire modifié avec succès');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Erreur lors de la modification du commentaire');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success('Commentaire supprimé avec succès');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Erreur lors de la suppression du commentaire');
    } finally {
      handleCloseMenu();
    }
  };

  const handleMenuOpen = (event, comment) => {
    setMenuAnchor(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedComment(null);
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditingContent(comment.content);
    handleCloseMenu();
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress/>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        Commentaires ({comments.length})
      </Typography>

      {/* Comment form for authenticated users */}
      {isAuthenticated ? (
        <Paper sx={{p: 3, mb: 3}}>
          <Box component="form" onSubmit={handleSubmitComment}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Ajoutez votre commentaire..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submitting}
              sx={{mb: 2}}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? 'Publication...' : 'Publier'}
              </Button>
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{p: 3, mb: 3, textAlign: 'center', bgcolor: 'grey.50'}}>
          <Typography variant="body2" color="text.secondary">
            Connectez-vous pour ajouter un commentaire
          </Typography>
        </Paper>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <Paper sx={{p: 3, textAlign: 'center', bgcolor: 'grey.50'}}>
          <Typography variant="body2" color="text.secondary">
            Aucun commentaire pour le moment. Soyez le premier à commenter !
          </Typography>
        </Paper>
      ) : (
        <Box>
          {comments.map((comment, index) => (
            <Paper key={comment.id} sx={{p: 3, mb: 2}}>
              <Box display="flex" alignItems="flex-start" gap={2}>
                <Avatar
                  src={comment.commenter?.avatar_url}
                  alt={comment.commenter?.username}
                  sx={{width: 40, height: 40}}
                >
                  {comment.user?.name?.charAt(0)}
                </Avatar>

                <Box flex={1}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {comment.commenter?.username || 'Utilisateur inconnu'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.created_at)}
                        {comment.updated_at !== comment.created_at && ' (modifié)'}
                      </Typography>
                    </Box>

                    {isAuthenticated && user?.email === comment.user?.email && (
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, comment)}
                      >
                        <MoreVertIcon/>
                      </IconButton>
                    )}
                  </Box>

                  {editingId === comment.id ? (
                    <Box>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        sx={{mb: 2}}
                      />
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleEditComment(comment.id, editingContent)}
                        >
                          Sauvegarder
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={cancelEditing}
                        >
                          Annuler
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{whiteSpace: 'pre-wrap'}}>
                      {comment.body}
                    </Typography>
                  )}
                </Box>
              </Box>

              {index < comments.length - 1 && <Divider sx={{mt: 2}}/>}
            </Paper>
          ))}
        </Box>
      )}

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={() => startEditing(selectedComment)}>
          <EditIcon sx={{mr: 1}} fontSize="small"/>
          Modifier
        </MenuItem>
        <MenuItem
          onClick={() => handleDeleteComment(selectedComment?.id)}
          sx={{color: 'error.main'}}
        >
          <DeleteIcon sx={{mr: 1}} fontSize="small"/>
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  );
}
