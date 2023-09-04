function MyPage({ user }) {
    const { email, password, name } = user || {};
    return(
        <>
                <h1>회원정보</h1>
                <div>프로필 이미지</div>
                <button type="button" id="update_image_button">변경하기</button>

                <dt>Email</dt>
                <dd>{email}</dd>
                <button type="button" id="update_email_button">변경하기</button>
                <dt>Password</dt>
                <dd>{password}</dd>
                <button type="button" id="update_password_button">변경하기</button>
                <dt>Name</dt>
                <dd>{name}</dd>
                <button type="button" id="update_name_button">변경하기</button>
        </>

    );
}
export default MyPage;