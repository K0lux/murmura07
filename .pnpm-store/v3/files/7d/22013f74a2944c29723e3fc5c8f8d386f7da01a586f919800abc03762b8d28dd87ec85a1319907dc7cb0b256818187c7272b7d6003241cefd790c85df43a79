import ts from 'typescript';
export class ScriptFile {
    content;
    fileName;
    modifiedTime;
    originalContent;
    sourceFile;
    constructor(content, fileName, modifiedTime = new Date()) {
        this.content = content;
        this.fileName = fileName;
        this.modifiedTime = modifiedTime;
        this.originalContent = content;
    }
    write(content) {
        this.content = content;
        this.touch();
    }
    watcher;
    mutate(mutant) {
        this.guardMutationIsWatched();
        const start = this.getOffset(mutant.location.start);
        const end = this.getOffset(mutant.location.end);
        this.content = `${this.originalContent.substr(0, start)}${mutant.replacement}${this.originalContent.substr(end)}`;
        this.touch();
    }
    getOffset(pos) {
        if (!this.sourceFile) {
            this.sourceFile = ts.createSourceFile(this.fileName, this.content, ts.ScriptTarget.Latest, false, undefined);
        }
        return this.sourceFile.getPositionOfLineAndCharacter(pos.line, pos.column);
    }
    resetMutant() {
        this.guardMutationIsWatched();
        this.content = this.originalContent;
        this.touch();
    }
    guardMutationIsWatched() {
        if (!this.watcher) {
            throw new Error(`Tried to check file "${this.fileName}" (which is part of your typescript project), but no watcher is registered for it. Changes would go unnoticed. This probably means that you need to expand the files that are included in your project.`);
        }
    }
    touch() {
        this.modifiedTime = new Date();
        this.watcher?.(this.fileName, ts.FileWatcherEventKind.Changed);
    }
}
//# sourceMappingURL=script-file.js.map