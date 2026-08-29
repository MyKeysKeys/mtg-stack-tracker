import React, { useState } from 'react';
import { playerColorPalette } from '../../constants/players';

function Players({
  players,
  activePlayerId,
  maxPlayers,
  onAddPlayer,
  onRenamePlayer,
  onRecolorPlayer,
  onRemovePlayer,
  onSetActivePlayer,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openColorPickerId, setOpenColorPickerId] = useState(null);
  const maxPlayersReached = players.length >= maxPlayers;

  return (
    <section className={`players-section${isCollapsed ? ' players-section-collapsed' : ''}`}>
      <div className="players-heading">
        <button
          type="button"
          className="players-collapse-toggle"
          onClick={() => setIsCollapsed((current) => !current)}
          aria-expanded={!isCollapsed}
        >
          <span
            className={`players-collapse-icon${isCollapsed ? ' players-collapse-icon-collapsed' : ''}`}
            aria-hidden="true"
          />
          <h2>Players ({players.length}/{maxPlayers})</h2>
        </button>
        <button
          type="button"
          className="add-player-button"
          onClick={onAddPlayer}
          disabled={maxPlayersReached}
          title={maxPlayersReached ? `Maximum of ${maxPlayers} players reached` : undefined}
        >
          Add player
        </button>
      </div>
      {!isCollapsed && (
        players.length === 0 ? (
          <p className="players-empty">No players yet. Add one to assign controllers.</p>
        ) : (
          <ul className="players-list">
            {players.map((player) => (
              <li
                key={player.id}
                className={`player-row${player.id === activePlayerId ? ' player-row-active' : ''}`}
              >
                <div
                  className="player-color-picker"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenColorPickerId(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    className="player-color-picker-toggle"
                    style={{ '--player-color': player.color }}
                    onClick={() => setOpenColorPickerId((current) => (
                      current === player.id ? null : player.id
                    ))}
                    aria-haspopup="true"
                    aria-expanded={openColorPickerId === player.id}
                    aria-label={`Change ${player.name || 'player'} color`}
                  />
                  {openColorPickerId === player.id && (
                    <div className="player-color-options" role="menu">
                      {playerColorPalette
                        .filter((color) => (
                          color === player.color
                          || !players.some((other) => other.id !== player.id && other.color === color)
                        ))
                        .map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`player-color-option${player.color === color ? ' player-color-option-selected' : ''}`}
                            style={{ '--player-color': color }}
                            onClick={() => {
                              onRecolorPlayer(player.id, color);
                              setOpenColorPickerId(null);
                            }}
                            role="menuitemradio"
                            aria-checked={player.color === color}
                            aria-label={`Set ${player.name || 'player'} color to ${color}`}
                          />
                        ))}
                    </div>
                  )}
                </div>
                <input
                  className="player-name-input"
                  value={player.name}
                  onChange={(event) => onRenamePlayer(player.id, event.target.value)}
                  aria-label={`${player.name || 'Player'} name`}
                />
                <button
                  type="button"
                  className="set-active-player-button"
                  onClick={() => onSetActivePlayer(player.id)}
                  disabled={player.id === activePlayerId}
                >
                  {player.id === activePlayerId ? 'Casting' : 'Cast as'}
                </button>
                <button
                  type="button"
                  className="remove-player-button"
                  onClick={() => onRemovePlayer(player.id)}
                  aria-label={`Remove ${player.name || 'player'}`}
                  title={`Remove ${player.name || 'player'}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  );
}

export default Players;
