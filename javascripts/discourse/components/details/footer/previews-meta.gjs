import Component from "@glimmer/component";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import coldAgeClass from "discourse/helpers/cold-age-class";
import concatClass from "discourse/helpers/concat-class";
import formatDate from "discourse/helpers/format-date";
import { number } from "discourse/lib/formatter";
import icon from "discourse-common/helpers/d-icon";

export default class PreviewsMeta extends Component {
  @service siteSettings;

  get ratio() {
    const likes = parseFloat(this.args.topic.like_count);
    const posts = parseFloat(this.args.topic.posts_count);

    if (posts < 10) {
      return 0;
    }

    return (likes || 0) / posts;
  }

  get ratioText() {
    if (this.ratio > this.siteSettings.topic_post_like_heat_high) {
      return "high";
    }
    if (this.ratio > this.siteSettings.topic_post_like_heat_medium) {
      return "med";
    }
    if (this.ratio > this.siteSettings.topic_post_like_heat_low) {
      return "low";
    }
    return "";
  }

  get likesHeat() {
    if (this.ratioText?.length) {
      return `heatmap-${this.ratioText}`;
    }
  }

  <template>
    <div class="topic-meta">
      <div class="container">
        <div class="top-line">
          <div class="topic-views {{@topic.viewsHeat}} inline sub">
            {{icon "far-eye"}}
            {{number @topic.views numberKey="views_long"}}
          </div>
          <div
            class={{concatClass
              "topic-replies num posts-map inline sub"
              this.likesHeat
            }}
          >
            <span class="middot inline sub"></span>
            <a href={{@topic.firstPostUrl}} class="badge-posts">
              {{icon "far-comment"}}
              {{number @topic.replyCount noTitle="true"}}
            </a>
          </div>
        </div>
        <div class="bottom-line">
          <div
            class={{concatClass
              "topic-timing activity num inline sub topic-list-data"
              (coldAgeClass @topic.createdAt startDate=@topic.bumpedAt class="")
            }}
            title={{htmlSafe @topic.bumpedAtTitle}}
          >
            <span class="middot inline sub"></span>
            <a href="{{@topic.lastPostUrl}}">
              {{icon "far-clock"}}
              {{formatDate
                @topic.bumpedAt
                format="medium-with-ago"
                noTitle="true"
              }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>
}
//     class="num posts-map posts {{this.likesHeat}} topic-list-data"
//   >
//     <a href={{@topic.firstPostUrl}} class="badge-posts">
//       <PluginOutlet
//         @name="topic-list-before-reply-count"
//         @outletArgs={{hash topic=@topic}}
//       />
//       {{number @topic.replyCount noTitle="true"}}
//     </a>

//       <td class={{concatClass "num views topic-list-data" @topic.viewsHeat}}>
//   <PluginOutlet
//     @name="topic-list-before-view-count"
//     @outletArgs={{hash topic=@topic}}
//   />
//   {{number @topic.views numberKey="views_long"}}
// </td>

//   import { htmlSafe } from "@ember/template";
// import PluginOutlet from "discourse/components/plugin-outlet";
// import coldAgeClass from "discourse/helpers/cold-age-class";
// import concatClass from "discourse/helpers/concat-class";
// import formatDate from "discourse/helpers/format-date";

// const ActivityCell = <template>
//   <td
//     title={{htmlSafe @topic.bumpedAtTitle}}
//     class={{concatClass
//       "activity num topic-list-data"
//       (coldAgeClass @topic.createdAt startDate=@topic.bumpedAt class="")
//     }}
//   >
//     <a href={{@topic.lastPostUrl}} class="post-activity">
//       {{~! no whitespace ~}}
//       <PluginOutlet
//         @name="topic-list-before-relative-date"
//         @outletArgs={{hash topic=@topic}}
//       />
//       {{~formatDate @topic.bumpedAt format="tiny" noTitle="true"~}}
//     </a>
