import React from 'react';
import { connect } from 'react-redux';

import MarkdownPreview from '../markdown/preview';
import MarkdownEditor from '../markdown/editor';
import Toolbar from './toolbar';
// import { Modal } from '@/components/lib';
import { Modal } from 'antd';
import fetch from '@/utils/fetch';
import { Message } from '@/components/lib';

import { setArticleList } from '@/redux/action/article';

class Offside extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      fullScreen: false,
      inEdit: false
      // visible: false,
      // deleteCategory: {}
    };
  }
  toggleFullScreen = () => {
    this.setState({
      fullScreen: !this.state.fullScreen,
      inEdit: false
    });
  }
  toggleEditStatus = () => {
    this.setState({
      inEdit: !this.state.inEdit
    });
  }
  // showModal = (category) => {
  //   this.setState({
  //     visible: true,
  //     deleteCategory: category
  //   });
  // };

  // handleOk = () => {
  //   const { deleteCategory } = this.state;
  //   this.changeArticleStatus(deleteCategory);
  //   Message.success('删除文章成功');
  //   this.setState({
  //     visible: false,
  //     deleteCategory: {}
  //   });
  // };

  // handleCancel = () => {
  //   this.setState({
  //     visible: false
  //   });
  // };

  showConfirmDeleteDialog = (category) => {
    Modal.confirm({
      title: '你确定要删除该文章?',
      content: '删除后可在回车站找回。',
      okType: 'danger',
      icon: null,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.changeArticleStatus(category);
        Message.success('删除文章成功');
      },
      onCancel: () => {}
    });
  }
  changeArticleStatus = (category) => {
    fetch.post('/api/article/status', { id: category.id })
      .then((res) => {
        if (res.success) {
          let list = [...this.props.articleList];
          list && list.map((item, index) => {
            if (item.id.toString() === category.id.toString()) {
              list.splice(index, 1);
            }
          });
          this.props.setArticleList(list);
        }
      });
  }
  render () {
    let { articleDetail, handles, openDrawer } = this.props, { fullScreen, inEdit } = this.state;

    const toolbarPanel = (
      <Toolbar
        isFullscreen={fullScreen}
        inEdit={inEdit}
        openDrawer={openDrawer}
        article={articleDetail}
        handles={{
          toggleDrawerStatus: handles.toggleDrawerStatus,
          toggleFullScreen: this.toggleFullScreen,
          toggleEditStatus: this.toggleEditStatus,
          toggleArticlePublish: handles.toggleArticlePublish,
          saveArticle: handles.saveArticle,
          deleteArticle: this.showConfirmDeleteDialog
        }}
      />
    );
    return (
      <div className="main-container">
        {
          fullScreen ? (
            <div className="full-screen">
              {toolbarPanel}
              <div className={`screen-wrap${fullScreen && !inEdit ? ' screen-preview' : ''}`}>
                {
                  inEdit ? (
                    <div className="screen-content">
                      <div className="offside-title">
                        <input
                          type="text"
                          placeholder="文章名称"
                          value={articleDetail.title || ''}
                          autoFocus
                          onChange={(e) => {
                            handles.changeInput('title', e.target.value);
                          }}
                        />
                      </div>
                      <MarkdownEditor
                        className="screen-body"
                        value={articleDetail.content || ''}
                        onChange={(e) => handles.changeArticleContent(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="screen-content">
                      <div className="offside-title">
                        <div className="preview-title">{articleDetail.title || ''}</div>
                      </div>
                      <MarkdownPreview
                        className="screen-body"
                        value={articleDetail.content || ''}
                      />
                    </div>
                  )
                }
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="offside-header">
                <div className="offside-title">
                  <input
                    type="text"
                    placeholder="文章名称"
                    value={articleDetail.title || ''}
                    autoFocus
                    onChange={(e) => {
                      handles.changeInput('title', e.target.value);
                    }}
                  />
                </div>
                <div className="offside-route-name">
                  <input
                    type="text"
                    placeholder="路由地址"
                    value={articleDetail.routeName || ''}
                    autoFocus
                    onChange={(e) => {
                      handles.changeInput('routeName', e.target.value);
                    }}
                  />
                </div>
                {toolbarPanel}
              </div>

              <div className="offside-content">
                <MarkdownEditor
                  value={articleDetail.content || ''}
                  onChange={(e) => handles.changeArticleContent(e.target.value)}
                />
                <MarkdownPreview
                  className="content-preview"
                  value={articleDetail.content || ''}
                />
              </div>
            </React.Fragment>
          )
        }
        {/* <Modal
          title="你确定要删除该文章?"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <p>删除后可在回车站找回。</p>
        </Modal> */}
      </div>
    );
  }
}

export default connect(
  (state) => ({
    articleList: state.article.list.data
  }),
  (dispatch) => ({
    setArticleList: (list) => {
      dispatch(setArticleList(list));
    }
  })
)(Offside);
