import {injectable, inject, decorate} from "inversify";
import {TheiaPlugin, TheiaApplication} from "@theia/shell-dom";
import {h, ElementAttrs} from "@phosphor/virtualdom";
import {TreeWidget, VirtualWidget, ITreeNode} from "./tree";
import {FileNavigatorModel, IDirNode, IPathNode} from "./navigator-model";
import NodeProps = TreeWidget.NodeProps;

export const FILE_NAVIGATOR_CLASS = 'theia-FileNavigator';
export const PATH_NODE_CLASS = 'theia-PathNode';
export const DIR_NODE_CLASS = 'theia-DirNode';
export const PATH_ICON_CLASS = 'theia-PathIcon';

decorate(injectable(), TreeWidget);

@injectable()
export class FileNavigator extends TreeWidget<FileNavigatorModel> {

    static readonly ID = 'file-navigator';

    constructor(@inject(FileNavigatorModel) model: FileNavigatorModel) {
        super();
        this.addClass(FILE_NAVIGATOR_CLASS);
        this.id = FileNavigator.ID;
        this.title.label = 'Files';
        this.setModel(model);
    }

    getModel(): FileNavigatorModel {
        return super.getModel()!;
    }

    protected createNodeAttributes(node: ITreeNode, props: TreeWidget.NodeProps): ElementAttrs {
        if (IPathNode.is(node)) {
            return {
                ...super.createNodeAttributes(node, props),
                ondblclick: (event) => {
                    if (IDirNode.is(node)) {
                        this.getModel().toggleNodeExpansion(node);
                    } else {
                        // TODO open file
                    }
                    event.stopPropagation();
                }
            }
        }
        return super.createNodeAttributes(node, props);
    }

    protected createNodeClassNames(node: ITreeNode, props: NodeProps): string[] {
        const classNames = super.createNodeClassNames(node, props);
        if (IPathNode.is(node)) {
            classNames.push(PATH_NODE_CLASS);
        }
        if (IDirNode.is(node)) {
            classNames.push(DIR_NODE_CLASS);
        }
        return classNames;
    }

    protected decorateCaption(node: ITreeNode, caption: h.Child, props: NodeProps): h.Child {
        if (IPathNode.is(node)) {
            return this.decoratePathCaption(node, caption, props);
        }
        return super.decorateCaption(node, caption, props);
    }

    protected decoratePathCaption(node: IPathNode, caption: h.Child, props: NodeProps): h.Child {
        const pathIcon = h.span({className: PATH_ICON_CLASS});
        return super.decorateCaption(node, VirtualWidget.merge(pathIcon, caption), props);
    }
}

@injectable()
export class FileNavigatorContribution implements TheiaPlugin {

    constructor(@inject(FileNavigator) private fileNavigator: FileNavigator) {
    }

    onStart(app: TheiaApplication): void {
        this.fileNavigator.getModel().refresh();
        app.shell.addToLeftArea(this.fileNavigator);
    }

}