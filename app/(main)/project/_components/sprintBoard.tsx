"use client";
import React, { useState } from "react";
import SprintManager from "./sprintManager";

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0],
  );
  return (
    <div>
      {/* Sprint Manager  */}
      <SprintManager
        currentSprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* Kanbann Board  */}
    </div>
  );
};

export default SprintBoard;
