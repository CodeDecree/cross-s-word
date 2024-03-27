export interface ClueEntry {
    clue: string;
    answer: string;
    row: number;
    col: number;
}

export interface CrosswordData {
    across: { [key: number]: ClueEntry };
    down: { [key: number]: ClueEntry };
}

export function replace(answer: string, pos: number, char: string): string {
    return answer.substring(0, pos) + char + answer.substring(pos + 1);
}

