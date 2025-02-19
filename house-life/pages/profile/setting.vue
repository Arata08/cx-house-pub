<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar :is-back="true" title="设置" :border-bottom="false">
		</u-navbar>
		<!-- #endif -->

		<view>
			<u-cell-group>
				<u-cell-item title="头像" :arrow="true" hover-class="none" @click="updateAvatar">
					<u-avatar :src="pic" size="100"></u-avatar>
				</u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item title="昵称" :arrow="true" hover-class="none" @click="updateName">
					{{vuex_user.user.nickName}}
				</u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item title="电话(点击复制可用于登录)" :arrow="true" hover-class="none"
					@click="copy(vuex_user.user.phonenumber)">
					{{vuex_user.user.phonenumber}}
				</u-cell-item>
			</u-cell-group>
			<u-modal v-model="showModel" @confirm="confirmName" ref="uModal" :async-close="true" title="设置昵称">
				<view class="slot-content">
					<u-input v-model="nickName" type="text" :border="false" placeholder="请输入昵称" />
				</view>
			</u-modal>
			<u-cell-group>
				<u-cell-item title="修改密码" @click="changePassword"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="btn">
			<u-button type="default" @click="logout" plain>退出登录</u-button>
		</view>
	</view>
</template>

<script>
	import config from "@/common/config.js" // 全局配置文件
	export default {
		data() {
			return {
				pic: 'https://free4.yunpng.top/2025/02/19/67b587e227050.jpg',
				nickName: "帅哥",
				showModel: false,
				phonenumber: '19515861232',
				vuex_user: {
					user: {
						nickName: '张三',
						phonenumber: '19515861232',
						avatar: 'https://free4.yunpng.top/2025/02/19/67b587e227050.jpg'
					}
				}
			};
		},
		onShow() {},
		methods: {
			copy(value) {},
			setAvatar() {
				const lifeData = uni.getStorageSync('lifeData').vuex_user.user;
				this.pic = lifeData.avatar;
				this.phonenumber = lifeData.phonenumber;
				if (!this.pic.startsWith('http')) {
					this.pic = config.staticUrl + this.pic;
				}
			},
			updateName() {
				this.showModel = true;
			},
			confirmName() {
				if (!this.nickName) {
					this.showModel = false;
					return this.$mytip.toast('请输入昵称')
				}
				this.showModel = false;
				this.$mytip.toast('昵称修改成功')
			},
			updateAvatar() {
				this.$u.route('/pages/profile/avatar')
			},
			subProfile() {
				// 1.更新vuex中的用户信息
				this.$mytip.toast('修改成功')
				// 2.页面跳转
				uni.switchTab({
					url: '/pages/index/center'
				})
			},
			logout() {
				// 退出登录修改token与用户信息
				this.$u.vuex('vuex_token', '');
				this.$u.vuex('vuex_user', {});
				return uni.reLaunch({
					url: '../index/index'
				})
			},
			changePassword() {
				this.$u.route('/pages/profile/password')
			}
		}
	}
</script>

<style lang="scss">
	.btn {
		margin: 20rpx;
	}
</style>