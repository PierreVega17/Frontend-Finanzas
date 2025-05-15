import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Typography, IconButton, Tooltip, TextField, Select, MenuItem, CircularProgress,
  Box
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const MovementRow = memo(({ 
  movement, 
  editingId, 
  editData, 
  savingId, 
  categories,
  onEditClick,
  onSave,
  onCancel,
  onChange,
  onDelete
}) => {
  const isEditing = editingId === movement._id;

  const currencies = [
    { symbol: '$', name: 'Dólar' },
    { symbol: 'S/', name: 'Sol' },
    { symbol: '€', name: 'Euro' },
    { symbol: '£', name: 'Libra' },
    { symbol: 'R$', name: 'Real' }
  ];

  return (
    <TableRow 
      hover
      sx={{ 
        '&:hover': {
          backgroundColor: 'var(--table-row-hover)'
        }
      }}
    >
      <TableCell>
        {isEditing ? (
          <Select
            value={editData.type}
            onChange={(e) => onChange('type')(e)}
            size="small"
            fullWidth
          >
            <MenuItem value="income">Ingreso</MenuItem>
            <MenuItem value="expense">Egreso</MenuItem>
          </Select>
        ) : (
          <Typography
            component="span"
            sx={{ 
              color: movement.type === 'income' ? 'success.main' : 'error.main',
              fontWeight: 500
            }}
          >
            {movement.type === 'income' ? 'Ingreso' : 'Egreso'}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              value={editData.amount}
              onChange={(e) => onChange('amount')(e)}
              size="small"
              type="number"
              sx={{ flex: 1 }}
            />
            <Select
              value={editData.currency || '$'}
              onChange={(e) => onChange('currency')(e)}
              size="small"
              sx={{ width: '80px' }}
            >
              {currencies.map((curr) => (
                <MenuItem key={curr.symbol} value={curr.symbol} title={curr.name}>
                  {curr.symbol}
                </MenuItem>
              ))}
            </Select>
          </Box>
        ) : (
          <Typography
            component="span"
            sx={{ 
              color: movement.type === 'income' ? 'success.main' : 'error.main',
              fontWeight: 500
            }}
          >
            {movement.currency || '$'}{movement.amount.toFixed(2)}
          </Typography>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={editData.category || ''}
            onChange={(e) => onChange('category')(e)}
            size="small"
            fullWidth
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        ) : (
          movement.category || '-'
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            type="date"
            value={editData.date}
            onChange={(e) => onChange('date')(e)}
            size="small"
            fullWidth
          />
        ) : (
          new Date(movement.date).toLocaleDateString()
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <TextField
            value={editData.description || ''}
            onChange={(e) => onChange('description')(e)}
            size="small"
            fullWidth
          />
        ) : (
          movement.description || '-'
        )}
      </TableCell>

      <TableCell align="center">
        {isEditing ? (
          <>
            <Tooltip title="Guardar">
              <IconButton
                onClick={() => onSave(movement._id)}
                size="small"
                disabled={savingId === movement._id}
                color="primary"
              >
                {savingId === movement._id ? (
                  <CircularProgress size={20} />
                ) : (
                  <CheckIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancelar">
              <IconButton
                onClick={onCancel}
                size="small"
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => onEditClick(movement)}
                size="small"
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => onDelete(movement._id)}
                size="small"
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </TableCell>
    </TableRow>
  );
});

const MovementsList = React.memo(({ movements, onEdit, onDelete, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [savingId, setSavingId] = useState(null);

  const categories = useMemo(() => ['Comida', 'Transporte', 'Salario', 'Ocio', 'Servicios', 'Otros'], []);

  useEffect(() => {
    if (!onRefresh) return;
    
    const interval = setInterval(onRefresh, 30000);
    return () => clearInterval(interval);
  }, [onRefresh]);

  const handleEditClick = useCallback((movement) => {
    setEditingId(movement._id);
    setEditData({
      type: movement.type,
      amount: movement.amount.toString(),
      category: movement.category,
      description: movement.description,
      date: movement.date.split('T')[0],
      currency: movement.currency || '$'
    });
  }, []);

  const handleSave = useCallback(async (id) => {
    if (!editData || !onEdit) return;
    
    setSavingId(id);
    try {
      await onEdit(id, {
        ...editData,
        amount: parseFloat(editData.amount),
        currency: editData.currency || '$'
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setSavingId(null);
    }
  }, [editData, onEdit]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const handleChange = useCallback((field) => (e) => {
    setEditData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  return (
    <TableContainer component={Paper} sx={{ 
      mt: 4,
      backgroundColor: 'var(--paper-bg)',
      borderRadius: 2,
      boxShadow: 3,
      overflow: 'hidden'
    }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'var(--table-header-bg)' }}>
            <TableCell>Tipo</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movements.map((movement) => (
            <MovementRow
              key={movement._id}
              movement={movement}
              editingId={editingId}
              editData={editData}
              savingId={savingId}
              categories={categories}
              onEditClick={handleEditClick}
              onSave={handleSave}
              onCancel={handleCancel}
              onChange={handleChange}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

export default MovementsList;
