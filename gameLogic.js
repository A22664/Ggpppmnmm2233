// gameLogic.js
import { Chess } from 'chess.js';

export class GameState {
    constructor() {
        this.chess = new Chess();
    }

    // محاولة تحريك قطعة (ترجع الحركة إذا كانت صحيحة، أو null إذا كانت خاطئة)
    attemptMove(source, target) {
        try {
            // نضيف ترقية البيدق التلقائية إلى وزير (Queen) كإعداد افتراضي
            const move = this.chess.move({
                from: source,
                to: target,
                promotion: 'q' 
            });
            this.updateUI();
            return move;
        } catch (e) {
            // الحركة غير قانونية
            return null;
        }
    }

    updateUI() {
        const statusEl = document.getElementById('game-status');
        if (!statusEl) return;

        let statusText = this.chess.turn() === 'w' ? "White's Turn" : "Black's Turn";

        if (this.chess.isCheckmate()) {
            statusText = `CHECKMATE! ${this.chess.turn() === 'w' ? 'Black' : 'White'} Wins!`;
            statusEl.style.color = "#ff3333";
        } else if (this.chess.isDraw()) {
            statusText = "DRAW!";
        } else if (this.chess.isCheck()) {
            statusText += " - CHECK!";
            statusEl.style.color = "#ffaa00";
        } else {
            statusEl.style.color = "#aaaaaa";
        }

        statusEl.innerText = statusText;
    }
}
