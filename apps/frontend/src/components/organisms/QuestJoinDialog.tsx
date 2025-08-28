// components/QuestJoinDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from "@mui/material";

interface QuestJoinDialogProps {
  quest: any | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuestJoinDialog: React.FC<QuestJoinDialogProps> = ({
  quest,
  isOpen,
  onClose,
}) => {
  if (!quest) return null;

  const currentParticipants = quest._count?.quest_participants || 0;
  const maxParticipants = quest.maxParticipants || "-";

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#fef3c7",
          border: "3px solid #d1a054",
          borderRadius: "16px",
          p: 2,
          fontFamily: "'Noto Sans JP', sans-serif",
          color: "#374151",
        },
      }}

    >
      <DialogTitle
        sx={{
          fontSize: "1.5rem",
          color: "#1e3a8a",
          textAlign: "center",
        }}
      >
        {quest.title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          sx={{
            fontSize: "1rem",
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          {quest.description}
        </DialogContentText>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.875rem",
            fontWeight: "bold",
            mb: 2,
            color: "#16a34a",
          }}
        >
          <span>難易度: {quest.difficulty}</span>
          <span>参加者: {currentParticipants}/{maxParticipants} 名</span>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#451a03",
            color: "#fef3c7",
            fontWeight: "bold",
            borderRadius: "8px",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "#6b3a0a",
            },
          }}
        >
          キャンセル
        </Button>

        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #1e3a8a, #3b82f6)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            px: 3,
            py: 1,
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            "&:hover": {
              background: "linear-gradient(45deg, #3b82f6, #1e3a8a)",
              boxShadow: "0 6px 8px rgba(0,0,0,0.4)",
            },
          }}
        >
          参加する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestJoinDialog;
