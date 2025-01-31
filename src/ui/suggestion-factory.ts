import { SuggestionItem } from "../matcher";
import { uniqFlatMap } from "../utils/collection-helper";
import { ALIAS, FOLDER, TAG } from "./icons";

interface Elements {
  itemDiv: HTMLDivElement;
  descriptionDiv?: HTMLDivElement;
}

interface Options {
  showDirectory: boolean;
  showAliasesOnTop: boolean;
}

function createItemDiv(
  item: SuggestionItem,
  aliases: string[],
  options: Options
): Elements["itemDiv"] {
  const itemDiv = createDiv({
    cls: [
      "another-quick-switcher__item",
      item.phantom ? "another-quick-switcher__phantom_item" : "",
    ],
  });

  const entryDiv = createDiv({
    cls: "another-quick-switcher__item__entry",
  });

  const titleDiv = createDiv({
    cls: "another-quick-switcher__item__title",
    text:
      options.showAliasesOnTop && aliases.length > 0
        ? aliases.join(" / ")
        : item.file.basename,
  });
  entryDiv.appendChild(titleDiv);

  if (options.showDirectory) {
    const directoryDiv = createDiv({
      cls: "another-quick-switcher__item__directory",
    });
    directoryDiv.insertAdjacentHTML("beforeend", FOLDER);
    directoryDiv.appendText(` ${item.file.parent.name}`);
    entryDiv.appendChild(directoryDiv);
  }

  itemDiv.appendChild(entryDiv);

  return itemDiv;
}

function createDescriptionDiv(
  item: SuggestionItem,
  aliases: string[],
  tags: string[],
  options: Options
): Elements["descriptionDiv"] {
  const descriptionDiv = createDiv({
    cls: "another-quick-switcher__item__descriptions",
  });

  if (aliases.length > 0) {
    const aliasDiv = createDiv({
      cls: "another-quick-switcher__item__description",
    });

    const displayAliases = options.showAliasesOnTop
      ? [item.file.basename]
      : aliases;
    displayAliases.forEach((x) => {
      const aliasSpan = createSpan({
        cls: "another-quick-switcher__item__description__alias",
      });
      aliasSpan.insertAdjacentHTML("beforeend", ALIAS);
      aliasSpan.appendText(x);
      aliasDiv.appendChild(aliasSpan);
    });
    descriptionDiv.appendChild(aliasDiv);
  }

  if (tags.length > 0) {
    const tagsDiv = createDiv({
      cls: "another-quick-switcher__item__description",
    });
    tags.forEach((x) => {
      const tagsSpan = createSpan({
        cls: "another-quick-switcher__item__description__tag",
      });
      tagsSpan.insertAdjacentHTML("beforeend", TAG);
      tagsSpan.appendText(x.replace("#", ""));
      tagsDiv.appendChild(tagsSpan);
    });
    descriptionDiv.appendChild(tagsDiv);
  }

  return descriptionDiv;
}

export function createElements(
  item: SuggestionItem,
  options: Options
): Elements {
  const aliases = uniqFlatMap(
    item.matchResults.filter((res) => res.alias),
    (x) => x.meta ?? []
  );
  const tags = uniqFlatMap(
    item.matchResults.filter((res) => res.type === "tag"),
    (x) => x.meta ?? []
  );

  const itemDiv = createItemDiv(item, aliases, options);

  if (aliases.length === 0 && tags.length === 0) {
    return { itemDiv };
  }
  const descriptionDiv = createDescriptionDiv(item, aliases, tags, options);

  return {
    itemDiv,
    descriptionDiv,
  };
}
