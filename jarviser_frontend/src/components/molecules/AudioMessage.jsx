import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const AudioMessage = ({
  audioMessage,
  onEditClick,
  onSaveClick,
  accessToken,
}) => {
  const [editedContent, setEditedContent] = useState(audioMessage.content);

  const handleSaveClick = async () => {
    try {
      await onSaveClick(editedContent);

      const response = await axios.post(
        window.SERVER_URL+"" + "/meeting/audiomessage/update",
        {
          audioMessageId: audioMessage.audioMessageId,
          content: editedContent,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 200) {
        onSaveClick(editedContent);
      }
    } catch (error) {
      console.error("Error updating audio message:", error);
    }
  };

  return (
    <div>
      <p>Name: {audioMessage.name}</p>
      {audioMessage.isEditing ? (
        <div>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <Button onClick={handleSaveClick}>Save</Button>
        </div>
      ) : (
        <div>
          <p>Content: {audioMessage.content}</p>
          <Button onClick={onEditClick}>Edit</Button>
        </div>
      )}
    </div>
  );
};

export default AudioMessage;

const Button = styled.button`
  background-color: #749bc2;
  border: none;
  border-radius: 5px;
  color: #f6f4eb;
`;

const Textarea = styled.textarea`
  background-color: #4682a9;
  color: #f6f4eb;
  border: none;
  border-radius: 5px;
  width: 100%;
`;
